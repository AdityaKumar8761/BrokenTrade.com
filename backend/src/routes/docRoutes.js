const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// ─── GET DOCUMENTATION DIRECTORY STRUCTURE ──────────────────────────
router.get('/structure', (req, res) => {
    try {
        const structure = [];
        
        // Ensure data directory exists
        if (!fs.existsSync(DATA_DIR)) {
            return res.status(200).json([]);
        }

        // Read all top-level folders
        const categories = fs.readdirSync(DATA_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        categories.forEach(category => {
            const categoryObj = {
                category,
                files: []
            };

            const catPath = path.join(DATA_DIR, category);
            const files = fs.readdirSync(catPath)
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
            
            categoryObj.files = files;
            structure.push(categoryObj);
        });

        res.status(200).json(structure);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error while reading structure' });
    }
});

// ─── GET DOCUMENTATION CONTENT ─────────────────────────────────────────
router.get('/content/:category/:file', (req, res) => {
    try {
        const { category, file } = req.params;
        const filePath = path.join(DATA_DIR, category, `${file}.json`);

        // Prevent directory traversal attacks
        if (!filePath.startsWith(DATA_DIR)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Documentation file not found' });
        }

        const rawData = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(rawData);

        res.status(200).json(jsonData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error while reading content' });
    }
});

module.exports = router;
