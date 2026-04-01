const User = require('../models/User');
const Itinerary = require('../models/Itinerary');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
    try {
        const userCount = await User.countDocuments({ role: 'user' });
        const itineraryCount = await Itinerary.countDocuments();
        const destinationCount = await Destination.countDocuments();
        const bookingCount = await Booking.countDocuments();

        // Simple revenue calculation from bookings
        const bookings = await Booking.find({ status: 'Confirmed' });
        const totalRevenue = bookings.reduce((acc, booking) => acc + (booking.cost || 0), 0);

        // Recent activity (last 5 itineraries)
        const recentItineraries = await Itinerary.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        // AI Usage Stats
        const AIUsage = require('../models/AIUsage');
        const aiUsage = await AIUsage.aggregate([
            {
                $group: {
                    _id: null,
                    totalTokens: { $sum: '$tokensUsed' },
                    totalCost: { $sum: '$cost' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const aiStats = aiUsage[0] || { totalTokens: 0, totalCost: 0, count: 0 };

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    users: userCount,
                    itineraries: itineraryCount,
                    destinations: destinationCount,
                    bookings: bookingCount,
                    revenue: totalRevenue,
                    aiUsage: aiStats
                },
                recentItineraries
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
