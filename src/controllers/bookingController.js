const BookingModel = require("../models/bookingModel");
const TrainModel = require("../models/trainModel");

const bookSeat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { trainId } = req.body;

        if (!trainId) {
            return res.status(400).json({ error: "Train ID is required" });
        }

        // Attempt to book a seat
        const booking = await BookingModel.createBooking(userId, trainId);

        if (!booking) {
            return res.status(400).json({ error: "Seat booking failed. No seats available." });
        }

        res.status(201).json({ message: "Seat booked successfully", booking });
    } catch (error) {
        console.error("Error booking seat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.id; // Get logged-in user's ID from token

        const booking = await BookingModel.getBookingById(bookingId);

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Ensure the booking belongs to the logged-in user
        if (booking.user_id !== userId) {
            return res.status(403).json({ error: "Forbidden: You are not allowed to view this booking" });
        }

        res.status(200).json({ booking });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await BookingModel.getUserBookings(userId);
        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { bookSeat, getBookingById, getUserBookings };
