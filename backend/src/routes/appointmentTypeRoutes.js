const express = require('express');
const protect = require('../middleware/authMiddleware')
const isAdmin = require("../middleware/adminMiddleware");
const { 
    createAppointmentType, 
    getAllAppointmentTypes, 
    getAppointmentTypeById, 
    deleteAppointmentType, 
    updateAppointmentType,
  } = require('../controllers/appointmentTypeController');

const router = express.Router();

router.delete('/:id', deleteAppointmentType);
router.post('/', createAppointmentType);
router.get('/',getAllAppointmentTypes);
router.get('/:id', getAppointmentTypeById);
router.put('/:id', updateAppointmentType);
module.exports = router;
