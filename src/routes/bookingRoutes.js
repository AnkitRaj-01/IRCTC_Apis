const express = require("express");
const { bookSeat, getBookingById, getUserBookings } = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes (only logged-in users can access)
router.post("/book", authMiddleware, bookSeat);
router.get("/:id", authMiddleware, getBookingById);
router.get("/user/bookings", authMiddleware, getUserBookings);

module.exports = router;
