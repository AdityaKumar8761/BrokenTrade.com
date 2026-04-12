const express = require('express');
const router = express.Router();
const Chat = require('../modules/chat');
const User = require('../modules/user');

// ─── INITIATE OR GET CHAT ──────────────────────────────────
router.post('/initiate', async (req, res) => {
    try {
        const { learnerId, brokerId } = req.body;

        if (!learnerId || !brokerId) {
            return res.status(400).json({ error: 'Missing learnerId or brokerId' });
        }

        // Find existing chat or create new
        let chat = await Chat.findOne({ learnerId, brokerId });

        if (!chat) {
            chat = new Chat({
                learnerId,
                brokerId,
                messages: []
            });
            await chat.save();
        }

        // Always populate before returning to ensure frontend has user details
        const populatedChat = await Chat.findById(chat._id)
            .populate('learnerId', 'name image')
            .populate('brokerId', 'name image description rating title');

        res.status(200).json(populatedChat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── GET CHAT BY ID (with populated user info) ──────────────
router.get('/:id', async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate('learnerId', 'name image')
            .populate('brokerId', 'name image description rating title');

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── SEND MESSAGE ──────────────────────────────────────────
router.post('/:id/send', async (req, res) => {
    try {
        const { senderId, text } = req.body;
        const chatId = req.params.id;

        if (!senderId || !text) {
            return res.status(400).json({ error: 'Missing senderId or text' });
        }

        const chat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: {
                    messages: {
                        senderId,
                        text,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        ).populate('learnerId', 'name image').populate('brokerId', 'name image description rating title');

        res.status(200).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── GET USER INBOX (List of all chats) ─────────────────────
router.get('/inbox/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find chats where the user is either the learner or the broker
        const chats = await Chat.find({
            $or: [{ learnerId: userId }, { brokerId: userId }]
        })
        .populate('learnerId', 'name image')
        .populate('brokerId', 'name image')
        .sort({ updatedAt: -1 });

        res.status(200).json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── GET UNIQUE CLIENT COUNT FOR BROKER ───────────────────
router.get('/count/:brokerId', async (req, res) => {
    try {
        const { brokerId } = req.params;
        const count = await Chat.countDocuments({ brokerId });
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
