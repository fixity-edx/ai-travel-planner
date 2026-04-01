const mongoose = require('mongoose');

const AIUsageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    endpoint: String,
    model: String,
    tokensUsed: Number,
    cost: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AIUsage', AIUsageSchema);
