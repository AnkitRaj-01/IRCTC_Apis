const pool = require("../config/db");

exports.addTrain = async (req, res) => {
    const { name, source, destination, total_seats } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES ($1, $2, $3, $4, $4) RETURNING *",
            [name, source, destination, total_seats]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTrains = async (req, res) => {
    const { source, destination } = req.query;

    try {
        const result = await pool.query(
            "SELECT * FROM trains WHERE source = $1 AND destination = $2",
            [source, destination]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
