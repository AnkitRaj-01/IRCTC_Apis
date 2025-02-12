const pool = require("../config/db");

const TrainModel = {
    createTrain: async (name, source, destination, totalSeats) => {
        const query = `
            INSERT INTO trains (name, source, destination, total_seats, available_seats) 
            VALUES ($1, $2, $3, $4, $4) 
            RETURNING *
        `;
        const values = [name, source, destination, totalSeats];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    getTrainsByRoute: async (source, destination) => {
        const query = "SELECT * FROM trains WHERE source = $1 AND destination = $2";
        const result = await pool.query(query, [source, destination]);

        return result.rows;
    },

    getTrainById: async (trainId) => {
        const query = "SELECT * FROM trains WHERE id = $1";
        const result = await pool.query(query, [trainId]);

        return result.rows.length > 0 ? result.rows[0] : null;
    },

    updateSeatAvailability: async (trainId, seats) => {
        const query = "UPDATE trains SET available_seats = available_seats - $1 WHERE id = $2 RETURNING *";
        const values = [seats, trainId];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
};

module.exports = TrainModel;
