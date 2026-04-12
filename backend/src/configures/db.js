const mongoose = require('mongoose');

// MongoDB connection URL
const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/Broke_Treade';

// Connect to MongoDB
mongoose.connect(mongoURL);

// Get default connection
const db = mongoose.connection;

// Event listeners
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Export connection
module.exports = db;
