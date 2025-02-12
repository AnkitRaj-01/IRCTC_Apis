const pool = require("../config/db");

const BookingModel = {
    createBooking: async (userId, trainId) => {
        const client = await pool.connect();
        try {
            await client.query("BEGIN"); // Start transaction

            // Check seat availability
            const trainQuery = "SELECT available_seats FROM trains WHERE id = $1 FOR UPDATE";
            const trainResult = await client.query(trainQuery, [trainId]);

            if (trainResult.rows.length === 0) {
                throw new Error("Train not found");
            }

            if (trainResult.rows[0].available_seats <= 0) {
                throw new Error("No seats available");
            }

            // Reduce seat count
            const updateSeatsQuery = `
                UPDATE trains SET available_seats = available_seats - 1 
                WHERE id = $1 RETURNING available_seats
            `;
            await client.query(updateSeatsQuery, [trainId]);

            // Insert booking
            const bookingQuery = `
                INSERT INTO bookings (user_id, train_id) 
                VALUES ($1, $2) 
                RETURNING id, user_id, train_id, booking_time
            `;
            const bookingResult = await client.query(bookingQuery, [userId, trainId]);

            await client.query("COMMIT"); // Commit transaction
            return bookingResult.rows[0];
        } catch (error) {
            await client.query("ROLLBACK"); // Rollback in case of error
            console.error("Error booking seat:", error);
            return null;
        } finally {
            client.release(); // Release client back to pool
        }
    },

    getBookingById: async (bookingId) => {
        const query = `
            SELECT 
                b.id AS booking_id, 
                b.booking_time,
                u.id AS user_id, 
                u.name AS user_name, 
                u.email AS user_email, 
                t.id AS train_id, 
                t.name AS train_name, 
                t.source, 
                t.destination
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN trains t ON b.train_id = t.id
            WHERE b.id = $1
        `;
        const result = await pool.query(query, [bookingId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    },

    getUserBookings: async (userId) => {
        const query = `
            SELECT 
                b.id AS booking_id, 
                b.booking_time,
                t.id AS train_id, 
                t.name AS train_name, 
                t.source, 
                t.destination
            FROM bookings b
            JOIN trains t ON b.train_id = t.id
            WHERE b.user_id = $1
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }
};

module.exports = BookingModel;
