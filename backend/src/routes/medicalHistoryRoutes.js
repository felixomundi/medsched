const express = require('express');
const { createMedicalRecords, getAllRecords } = require('../controllers/medicalHistoryController');
const protect = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/", protect ,createMedicalRecords);
router.get("/", protect , getAllRecords);

module.exports = router;