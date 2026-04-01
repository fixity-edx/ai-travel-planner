const Itinerary = require('../models/Itinerary');
const { generateAIItinerary } = require('../services/aiService');

// @desc    Get all user itineraries
// @route   GET /api/itineraries
// @access  Private
exports.getItineraries = async (req, res, next) => {
    try {
        const itineraries = await Itinerary.find({ user: req.user.id });
        res.status(200).json({ success: true, count: itineraries.length, data: itineraries });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single itinerary
// @route   GET /api/itineraries/:id
// @access  Private
exports.getItinerary = async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            return res.status(404).json({ success: false, error: 'Itinerary not found' });
        }

        // Make sure user owns itinerary
        if (itinerary.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to access this itinerary' });
        }

        res.status(200).json({ success: true, data: itinerary });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create manual itinerary
// @route   POST /api/itineraries
// @access  Private
exports.createItinerary = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const itinerary = await Itinerary.create(req.body);
        res.status(201).json({ success: true, data: itinerary });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Generate AI itinerary
// @route   POST /api/itineraries/generate-ai
// @access  Private
exports.generateAIItineraryCtrl = async (req, res, next) => {
    try {
        const { destination, duration, budget, preferences, startDate, endDate } = req.body;

        if (!destination || !duration || !budget) {
            return res.status(400).json({ success: false, error: 'Please provide destination, duration and budget' });
        }

        const aiData = await generateAIItinerary(destination, duration, budget, preferences || []);

        // Track Usage (simulated token usage based on prompt + response length)
        // Assuming approx 1 token per 4 chars
        const promptLen = destination.length + duration.toString().length + budget.toString().length + (preferences || []).join('').length;
        const itemsLen = JSON.stringify(aiData).length;
        const totalTokens = Math.ceil((promptLen + itemsLen) / 4);

        try {
            const AIUsage = require('../models/AIUsage');
            await AIUsage.create({
                user: req.user.id,
                endpoint: 'generate-ai',
                model: process.env.GROK_MODEL,
                tokensUsed: totalTokens,
                cost: (totalTokens / 1000) * 0.002 // Simulated cost $0.002 per 1k tokens
            });
        } catch (metricErr) {
            console.error('Failed to log AI metric:', metricErr);
        }

        // Log raw AI data for debugging
        console.log('Raw AI Data:', JSON.stringify(aiData, null, 2));

        // Helper to ensure we get a string from AI data
        const ensureString = (val, fallbacks = []) => {
            if (!val) return fallbacks[0] || '';
            if (typeof val === 'string') return val;
            if (typeof val === 'object') {
                // Try specific keys
                for (const key of ['overview', 'description', 'influence', 'forecast', 'trip', 'text', 'info']) {
                    if (val[key] && typeof val[key] === 'string') return val[key];
                    if (val[key] && typeof val[key] === 'object') return JSON.stringify(val[key]);
                }
                return JSON.stringify(val);
            }
            return String(val);
        };

        const summary = ensureString(aiData.summary, ['No summary provided.']);
        const weather = ensureString(aiData.weather, ['Weather information not available.']);

        const days = (aiData.days || []).map(day => ({
            ...day,
            activities: (day.activities || []).map(act => {
                let cleanCost = 0;
                if (act.cost !== undefined && act.cost !== null) {
                    if (typeof act.cost === 'number') {
                        cleanCost = act.cost;
                    } else {
                        // It's a string or something else, force it to string then parse
                        const costStr = String(act.cost);
                        const match = costStr.replace(/[^0-9.]/g, ' ').trim().split(' ')[0];
                        cleanCost = parseFloat(match) || 0;
                    }
                }

                return {
                    ...act,
                    cost: cleanCost
                };
            })
        }));

        const itineraryData = {
            user: req.user.id,
            destination,
            startDate,
            endDate,
            duration,
            budget,
            preferences: preferences || [],
            summary: summary,
            weather: weather,
            packingTips: aiData.packingTips,
            days: days,
            aiGenerated: true
        };

        const itinerary = await Itinerary.create(itineraryData);

        res.status(201).json({ success: true, data: itinerary });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'AI Itinerary Generation failed' });
    }
};

// @desc    Update itinerary
// @route   PUT /api/itineraries/:id
// @access  Private
exports.updateItinerary = async (req, res, next) => {
    try {
        let itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            return res.status(404).json({ success: false, error: 'Itinerary not found' });
        }

        // Make sure user owns itinerary
        if (itinerary.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this itinerary' });
        }

        itinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: itinerary });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete itinerary
// @route   DELETE /api/itineraries/:id
// @access  Private
exports.deleteItinerary = async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            return res.status(404).json({ success: false, error: 'Itinerary not found' });
        }

        // Make sure user owns itinerary or is admin
        if (itinerary.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this itinerary' });
        }

        await itinerary.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Summarize an attraction using AI
// @route   POST /api/itineraries/summarize
// @access  Private
exports.summarizeAttractionInfo = async (req, res, next) => {
    try {
        const { attraction, destination } = req.body;
        const { summarizeAttraction } = require('../services/aiService');
        const summary = await summarizeAttraction(attraction, destination);

        // Track Usage (simulated)
        try {
            const tokens = Math.ceil(summary.length / 4);
            const AIUsage = require('../models/AIUsage');
            await AIUsage.create({
                user: req.user.id,
                endpoint: 'summarize-attraction',
                model: process.env.GROK_MODEL,
                tokensUsed: tokens,
                cost: (tokens / 1000) * 0.002
            });
        } catch (e) {
            console.error('Failed to log AI metric', e);
        }

        res.status(200).json({ success: true, data: summary });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
