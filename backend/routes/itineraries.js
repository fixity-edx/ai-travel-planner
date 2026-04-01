const express = require('express');
const {
    getItineraries,
    getItinerary,
    createItinerary,
    generateAIItineraryCtrl,
    updateItinerary,
    deleteItinerary,
    summarizeAttractionInfo
} = require('../controllers/itineraries');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getItineraries)
    .post(createItinerary);

router.post('/generate-ai', generateAIItineraryCtrl);
router.post('/summarize', summarizeAttractionInfo);

router
    .route('/:id')
    .get(getItinerary)
    .put(updateItinerary)
    .delete(deleteItinerary);

module.exports = router;
