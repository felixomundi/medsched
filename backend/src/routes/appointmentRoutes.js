const express = require('express');
const protect = require('../middleware/authMiddleware')
const isAdmin = require("../middleware/adminMiddleware");
const { 
getAllAppointments,
getAuthUserAppointments,
deleteMyAppointment,
deleteAppointmentByAdmin,
rescheduleAppointment,
getDoctorAppointments,
bookAppointment,
getPatientsByAppointmentDate,
getDoctorsBySpecialty,
getDoctorsSpecialties,
sendPatientReminder,
getPatientReminders,
getAllUsersAsPatients,
getPatientAppointmentsByDate,
bookAppointmentByDoctor,
cancelAppointment,
patientDashboardReports, 
} = require('../controllers/appointmentsController');

const router = express.Router();

router.get('/', isAdmin,  getAllAppointments);
router.post("/auth-user", protect, bookAppointment);
router.post("/create", protect, bookAppointmentByDoctor); 
router.get("/auth-user", protect, getAuthUserAppointments);
router.delete('/:id', protect, deleteMyAppointment);
router.delete('/delete/:id', isAdmin, deleteAppointmentByAdmin);
router.get('/doctors', getDoctorsBySpecialty);
router.put('/reschedule/:appointmentId', protect, rescheduleAppointment);
router.get("/auth-doctor/appointments", protect, getDoctorAppointments);
router.get("/patients", protect, getPatientsByAppointmentDate);
router.get("/doctors/specialties", protect, getDoctorsSpecialties)
router.post("/reminder", protect, sendPatientReminder);
router.patch("/cancel", protect, cancelAppointment)
router.get("/reminders", protect, getPatientReminders);
router.get("/users", protect, getAllUsersAsPatients)
router.get("/by-date", protect, getPatientAppointmentsByDate)
router.get("/reports", protect, patientDashboardReports)
module.exports = router;

