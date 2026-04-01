const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: [true, 'Please add a destination']
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date']
    },
    duration: {
        type: Number,
        required: true
    },
    budget: {
        type: Number,
        required: [true, 'Please add a budget']
    },
    preferences: [String],
    summary: String,
    weather: String,
    packingTips: [String],
    days: [
        {
            day: Number,
            activities: [
                {
                    time: String,
                    activity: String,
                    location: String,
                    description: String,
                    cost: Number
                }
            ]
        }
    ],
    aiGenerated: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Planned', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Planned'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
