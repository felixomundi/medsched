const {Appointment,User,AppointmentType,  MedicalHistory} = require("./../database/models");

const createMedicalRecords = async (req, res) => {
    try {
      const {       
        patient,
        visitDate,
        symptoms,
        diagnosis,
        medications,
        notes,
        followUpDate,
        height,
        weight,
        bloodPressure,
        heartRate,
        allergies,
        pastSurgeries,
        familyHistory,
        socialHistory,
        diet,
        exercise,
        smoking,
        alcohol,
        appointmentId    
      } = req.body;
    if(!patient){
        return res.status(400).json({ message: 'patient field required' });
        }
      const doctorId = req.user.id; 
        
      // Create or find Appointment
      let appointment;
      if (appointmentId) {
        appointment = await Appointment.findByPk(appointmentId);
        if (!appointment) {
          return res.status(400).json({ message: 'Appointment not found' });
        }
      } 
      const patientExist = await User.findByPk(patient);
      if(!patientExist){
        return res.status(400).json({ message: 'Patient not found' });
      }
      // Create MedicalHistory
      const medicalHistory = await MedicalHistory.create({        
        patientId:patientExist.id,
        visitDate,
        symptoms,
        diagnosis,
        medications,
        notes,
        followUpDate,
        height,
        weight,
        bloodPressure,
        heartRate,
        allergies,
        pastSurgeries,
        familyHistory,
        socialHistory,
        diet,
        exercise,
        smoking,
        alcohol,
        appointmentId: appointment.id,
        doctorId,
      });

      await appointment.update({
        status: "completed"
      })
  
      return res.status(201).json({
        medicalHistory,
        message:'Medical History Created Successfully'
      });
    } catch (error) {     
      return res.status(400).json({ message: 'Failed to create medical history' });
    }

}

const getAllRecords = async (req, res) => {
  try {
    const userId = req.user.id; 
    const userRole = req.user.role; 

    let medicalHistory;

    if (userRole === 'user') {
      // Fetch medical history for logged-in user as a patient
      medicalHistory = await MedicalHistory.findAll({
        where: { patientId: userId },
        include: [
          {
            model: User,
            as: 'doctor',
            attributes: ["id", "name"],
          },
          {
            model: Appointment,
            as: 'appointment',
            attributes: ["specialty"],
            include: [{ model: AppointmentType, attributes: ["id", "name"] }],
          },
        ],
      });
    } else if (userRole === 'doctor') {
      // Fetch medical history for logged-in user as a doctor
      medicalHistory = await MedicalHistory.findAll({
        where: { doctorId: userId },
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ["id", "name"],
          },
          {
            model: Appointment,
            as: 'appointment',
            attributes: ["specialty"],
            include: [{ model: AppointmentType, attributes: ["id", "name"] }],
          },
        ],
      });
    } else if(req.user.role === "admin"){
       // Fetch medical history for logged-in user as a admin
      medicalHistory = await MedicalHistory.findAll({
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ["id", "name"],
          },
          {
            model: User,
            as: 'doctor',
            attributes: ["id", "name"],
          },
          {
            model: Appointment,
            as: 'appointment',
            attributes: ["specialty"],
            include: [{ model: AppointmentType, attributes: ["id", "name"] }],
          },
        ],
      });
    }else{
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    return res.status(200).json(medicalHistory);
  } catch (error) {   
    return res.status(400).json({ error: 'Internal Server Error' });
  }
}

module.exports ={
    createMedicalRecords,
    getAllRecords,
}