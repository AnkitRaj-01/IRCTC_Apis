const express = require("express");
const { addTrain, getTrains } = require("../controllers/trainController");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Only admin can add trains (API key required)
router.post("/add", adminMiddleware, addTrain);

// Anyone can get train list
router.get("/", getTrains);

module.exports = router;
