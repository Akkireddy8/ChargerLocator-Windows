const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    stationId: {
        type: String,
        required: true
    },
    chargerId: {
        type: String,
        required: true
    },
    energyConsumed: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    paymentTime: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    transactionId: {
        type: String,
        default: () => `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
