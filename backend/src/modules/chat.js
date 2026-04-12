const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brokerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, { 
  timestamps: true,
  // This will create the collection named 'chats' in the database
  collection: 'chats' 
});

// Ensure a single chat exists between a learner and a broker
chatSchema.index({ learnerId: 1, brokerId: 1 }, { unique: true });

module.exports = mongoose.model('Chat', chatSchema);
