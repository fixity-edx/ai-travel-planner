const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a destination name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    category: {
        type: String,
        enum: ['Beach', 'Mountain', 'City', 'Historical', 'Nature', 'Adventure'],
        default: 'City'
    },
    images: [String],
    bestTimeToVisit: String,
    averageBudget: {
        type: Number,
        required: [true, 'Please add an average budget per day']
    },
    popularAttractions: [
        {
            name: String,
            description: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Destination', DestinationSchema);
