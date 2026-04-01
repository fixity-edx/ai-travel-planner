const express = require('express');
const { getBookings, getAllBookings, createBooking, deleteBooking } = require('../controllers/bookings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/all', authorize('admin'), getAllBookings);

router
    .route('/')
    .get(getBookings)
    .post(createBooking);

router
    .route('/:id')
    .delete(deleteBooking);

module.exports = router;
