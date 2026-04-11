const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../modules/user');

// ─── REGISTER ───────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { name, email, mobile, pan, dob, password, type } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            mobile,
            pan,
            dob,
            password: hashedPassword,
            type: type || 'Learner',
        });

        const savedUser = await newUser.save();
        console.log('User registered:', savedUser.email);

        // Return user data (without password)
        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                type: savedUser.type,
            },
        });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── LOGIN ──────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log('User logged in:', user.email);

        // Return user data (without password)
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                type: user.type,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── GET ALL USERS ──────────────────────────────────────────
router.get('/all', async (req, res) => {
    try {
        // Fetch all users but exclude the password field
        const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── TOTAL USER COUNT ─────────────────────────────────────────
router.get('/count', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── UPDATE USER ──────────────────────────────────────────────
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent password update through this route for security
        if (updates.password) {
            delete updates.password;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ─── DELETE USER ──────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
