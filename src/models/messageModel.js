const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderType: { type: String, enum: ['user', 'manager'], required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);

