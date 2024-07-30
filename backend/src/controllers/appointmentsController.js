const { Op, where } = require("sequelize");
const {Appointment,User,AppointmentType, DoctorSpecialty,Reminder, MedicalHistory} = require("./../database/models");
const { mail } = require("../utils/email");
const { convertTo24HourFormat } = require("../utils/convertTo24HourFormat");
const { convertTo12HourFormat } = require("../utils/convertTo12HourFormat");


const getAllAppointments = async (req, res) => {
try {
    const appointments = await Appointment.findAll({
    include:[
        { model: User, as: 'doctor', attributes: ['id', 'name', 'email'] },
    { model: User, as: 'patient', attributes: ['id', 'name', 'email'] },
    {model:AppointmentType,  attributes:[ "name", "duration", "id"] },

],      
    
    order: [['id', 'DESC']], 
    });

    return res.status(200).json({ appointments });
} catch (error) {     
return   res.status(400).json({ error: 'Internal server error' });
}
};

const getAuthUserAppointments = async (req, res) => {
    try {
      
      const userId = req.user.id; 
      const appointments = 
      await Appointment.findAll({
        where: { patientId: userId },
        attributes:["id", "appointmentDate", "startTime", "endTime", "status", "specialty"],
        include: [
          { model: User, as: 'doctor', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'patient', attributes: ['id', 'name', 'email'] },
          { model: AppointmentType, attributes: ['id', 'name', 'description', 'duration', 'cost'] },
    

        ],
        order: [['id', 'DESC']],
      });
      return res.status(200).json({ appointments });
    } catch (error) {
     
      return res.status(400).json({ error: 'Internal server error' 
      });
    }
};

const deleteMyAppointment = async(req, res)=> {
    const appointmentId = req.params.id; 
    const userId = req.user.id; 
    try {
      // Attempt to find the appointment
      const appointment = await Appointment.findByPk(appointmentId);
  
      if (!appointment) {
        return res.status(400).json({ message: 'Appointment not found' });
      }
      // Check if the logged-in user is the owner of the appointment
    if (appointment.patientId !== userId) {
        return res.status(403).json({ message: 'Unauthorized to delete this appointment' });
      }

      // Delete the appointment
      await appointment.destroy();
  
    return  res.status(200).json({
        message: "Appointment Deleted Successfully"
    }); 
    } catch (error) {     
     return    res.status(400).json({ message: 'Failed to delete appointment' });
    }
}

const  deleteAppointmentByAdmin = async(req, res)=>  {
const appointmentId = req.params.id;

try {
// Find the appointment by ID
const appointment = await Appointment.findByPk(appointmentId);

if (!appointment) {
return res.status(400).json({ message: 'Appointment not found' });
}

// Delete the appointment
await Appointment.destroy({
where: { id: appointmentId }
});

return  res.status(200).json({
message:"Appointment deleted successfully"
}); 
} catch (error) {
return  res.status(400).json({ error: 'Failed to delete appointment' });
}
}

const getDoctorAppointments = async (req, res) => {
  try {    
    const userId = req.user.id; 
    const appointments = 
    await Appointment.findAll({
      where: { doctorId: userId },
      include: [
        { model: User, as: 'doctor', attributes: ['id', 'name', 'email'], required:true, },
        { model: User, as: 'patient', attributes: ['id', 'name', 'email'], required:true, },
        { model: AppointmentType, attributes: ['id', 'name', 'description', 'duration', 'cost'],required:true, },
      
      ],
      order: [['id', 'DESC']],
    });
    return res.status(200).json({ appointments });
  } catch (error) {
   
    return res.status(400).json({ message: 'Internal server error' });
  }
};


const  bookAppointment = async (req,res)=>{
try {
  let {doctorId,  appointmenttypeId, appointmentDate, startTime, endTime, specialty } = req.body;
 const  patient = req.user;   
  if(!doctorId){
      return res.status(400).json({
          message:"doctorId field required"
      })
  } 
  if(!appointmenttypeId){
      return res.status(400).json({
          message:"appointmenttypeId field required"
      })
  }    
  
  if(!appointmentDate){
    return res.status(400).json({
        message:"appointmentDate field required"
    })
}
  
  if(!startTime){
      return res.status(400).json({
          message:"startTime field is required"
      })
  }

  if(!endTime){
    return res.status(400).json({
        message:"endTime field is required"
    })
  }
  if(!specialty){
    return res.status(400).json({
        message:"specialty field required"
    })
}
  // check for doctor role
    const user = await User.findOne({
      where:{id:doctorId,}
    });
    if(!user){
        return res.status(400).json({
            message:"Doctor Not Found"
        })
    }
    if(user.role !== "doctor"){
        return res.status(400).json({
            message:"This user is not a doctor"
        })
    }
    const appointmenttype = await AppointmentType.findOne({
      where:{id:appointmenttypeId}
  });
  if(!appointmenttype){
      return res.status(400).json({
          message:"appointment type not found"
      })
  }
  const doctorspecialty = await DoctorSpecialty.findOne({where:{userId:user.id, 
      specialty 
  }});
  if(!doctorspecialty){
      return res.status(400).json({
          message:`User not specialised in ${specialty}`
      })
  }

  
// convert start and end time to 24 hours for saving to db
startTime = convertTo24HourFormat(startTime);
// endTime = convertTo24HourFormat(endTime);
if(!startTime){
  return res.status(400).json({ message: 'Invalid startTime string format'});
}
endTime = convertTo24HourFormat(endTime);
if(!endTime){
  return res.status(400).json({ message: 'Invalid endTime string format'});
}

  // continue with booking logic

 // Check if the appointment already exists
 const existingAppointment = await Appointment.findOne({
  where: {
    doctorId:user.id,
    appointmentDate,
    appointmenttypeId,
    specialty,
    startTime,
    endTime
  }
});


if (existingAppointment) {
  return res.status(400).json({ 
    message: 'An appointment at this time already exists for this provider.' });
}

// Create the new appointment
const newAppointment = await Appointment.create({
  doctorId,
  patientId:patient.id,
  appointmenttypeId,
  appointmentDate,
  startTime,
  endTime,
  specialty
});


const formattedDateString = new Date(newAppointment.appointmentDate).toDateString();
const formattedStartTime = convertTo12HourFormat(newAppointment.startTime);
const formattedEndTime  = convertTo12HourFormat(newAppointment.endTime);
// Compose email messages
const doctorSubject = 'Appointment Scheduled';
const doctorMessage = `Dear Dr. ${user.name},\n\nYou have a new appointment scheduled with Patient ${patient.name} on ${formattedDateString} at ${formattedStartTime} - ${formattedEndTime}.\n\nRegards,\nMedSched`;
const patientSubject = 'Appointment Confirmation';
const patientMessage = `Dear ${patient.name},\n\nYour appointment with Dr. ${user.name} is scheduled on ${formattedDateString} at ${formattedStartTime} - ${formattedEndTime}.\n\nRegards,\nMedSched`;

// Send emails to both doctor and patient
await Promise.all([
  mail(user.email, doctorSubject, doctorMessage).catch(error => {
    console.error('Error sending email to doctor:', error);
  }),
  mail(patient.email, patientSubject, patientMessage).catch(error => {
    console.error('Error sending email to patient:', error);
  })
]);


// Return success response to client
return res.status(201).json({ 
message: 'Appointment booked successfully',
newAppointment,
});

  
} catch (error) {
  console.log(error)
  return res.status(400).json({
    message:"Error in booking appointment",    
  })
}
}



const rescheduleAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { appointmentDate, startTime, endTime, doctorId, appointmenttypeId, specialty } = req.body;


  // Validate required fields
  if (!appointmentDate) {
    return res.status(400).json({ message: "appointmentDate field required" });
  }
  if (!startTime) {
    return res.status(400).json({ message: "startTime field required" });
  }
  if (!endTime) {
    return res.status(400).json({ message: "endTime field required" });
  }
  if (!doctorId) {
    return res.status(400).json({ message: "doctorId field required" });
  }
  
  if (!appointmenttypeId) {
    return res.status(400).json({ message: "appointmenttypeId field required" });
  }

  if (!specialty) {
    return res.status(400).json({ message: "speciality field required" });
  }

  // Convert time to 24-hour format
  const twentyFourHourStartTime = convertTo24HourFormat(startTime);
  const twentyFourHourEndTime = convertTo24HourFormat(endTime);

  // Validate time conversion
  if (!twentyFourHourStartTime || !twentyFourHourEndTime) {
    return res.status(400).json({ message: "Invalid time format. Please provide time in AM/PM format (e.g., '09:45 AM')." });
  }

  try {
    // Check for existing appointments that overlap with the new time slot
    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        specialty,
        appointmentDate,
        id: { [Op.not]: appointmentId }, // Exclude the current appointment being updated
        [Op.or]: [
          {
            startTime: { [Op.lt]: twentyFourHourEndTime },
            endTime: { [Op.gt]: twentyFourHourStartTime }
          },
          {
            startTime: twentyFourHourStartTime,
            endTime: twentyFourHourEndTime
          }
        ]
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "An appointment already exists for this doctor at the specified time." });
    }

    // update appointment based on user role
let appointment;
    if(req.user.role === "doctor" || req.user.role === "admin"){
       appointment = await Appointment.findOne({
        where:{id:appointmentId,          
        }
      });
    }else{
      // Update the appointment
      appointment = await Appointment.findOne({
        where:{id:appointmentId,
          patientId:req.user.id
        }
      });
    }

    if (!appointment) {
      return res.status(400).json({ message: "Appointment not found." });
    }
    // Update appointment details
    appointment.appointmentDate = appointmentDate;
    appointment.startTime = twentyFourHourStartTime;
    appointment.endTime = twentyFourHourEndTime;  

    await appointment.save();

    return res.json({ message: "Appointment updated successfully", appointment });
  } catch (error) {
    return res.status(400).json({ message: "Error in rescheduling appointment" });
  }
};

function formatDateToBackend(date) {
  const parts = date.split('-'); // Assuming date is in 'YYYY-MM-DD' format
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  // Construct a new Date object with the components
  const formattedDate = new Date(year, month - 1, day); // month - 1 because months are 0-indexed in JavaScript

  // Check if the constructed date is valid
  if (isNaN(formattedDate.getTime())) {
    return null;
  }

  // Return the formatted date object or string as needed by your backend
  return formattedDate; // or formattedDate.toISOString(), formattedDate.getTime(), etc.
}

const getPatientsByAppointmentDate = async(req,res) =>{
try {
const appointmentDate  = req.query.appointmentDate;
// Validate and parse the date in DD-MM-YYYY format
 if (!appointmentDate) {
  return res.status(400).json({ message: 'appointmentDate is required' });
}
const parsedDate = formatDateToBackend(appointmentDate); 
if(!parsedDate){
  return res.status(400).json({ message: 'Invalid Date' });
}
const patients = await User.findAll({
  attributes: ["id", "name"],
  include: [
    {
      model: Appointment,
      as: 'patient',
      where: { appointmentDate:parsedDate },
      required: true,
      include: [
        {
          model: AppointmentType,
          attributes: ["id", "name"]
        }
      ]
    },   

  ]
});

  return res.status(200).json(patients);  
  
} catch (error) {
  return res.status(400).json({
    message: "Error getting patients",
    error
  })
}
}

const getDoctorsBySpecialty = async (req, res) => {
  try {
    const {specialty} = req.query;
    const doctors = await User.findAll({
      where: { role: 'doctor' }, 
      attributes:["id","name"],
      include: [
        {
          model: DoctorSpecialty,
          as: 'specialties',
          where: { specialty: specialty }, 
          required: true, 
          attributes:["id","specialty"],
         
        },
      ],
    });

    return res.status(200).json(doctors);
  } catch (error) {
   return res.status(400).json({ message: 'Failed to fetch doctors by specialty' });
  }
};


const getDoctorsSpecialties = async (req, res) => {
  try {
   
    
    if(req.user.role !== "doctor"){
      return res.status(403).json({
        message:"Access Denied you are not doctor"
      });
    }
    const specialties = await DoctorSpecialty.findAll({
      where: { userId:req.user.id }, 
      attributes:["id", "specialty", "createdAt", "updatedAt"],
      // include: [
      //   {
      //     model: User,        
      //     where: { id:req.user.id }, 
      //     required: true, 
      //     attributes:["id","name"],
         
      //   },
      // ],
    });

    return res.status(200).json(specialties);
  } catch (error) { 
   return res.status(400).json({ message: 'Failed to fetch doctor specialties' });
  }
};


const sendPatientReminder = async(req,res)=>{
  try {
    const {appointmentId} = req.body;
    if(!appointmentId){
      return res.status(400).json({
        message:"appointmentId field is required"
      })
    }  

    // Ensure the user is either a doctor or an admin
    if (!['doctor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to send reminders"
      });
    }
    



    const appointment = await Appointment.findOne({
      where: {
        id: appointmentId,
          // Check if the user is the doctor assigned to the appointment or if the user is an admin
          [req.user.role === 'doctor' ? 'doctorId' : '']: req.user.id
      //  doctorId: req.user.id
      },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'email', 'phone'] 
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'name', 'phone'] 
        },
        {
          model: AppointmentType,
          attributes: ['name'] 
        }
      ]
    });

    if (!appointment) {
      return res.status(400).json({
        message: "Appointment not found"
      });
    }
    
const formattedAppoinmentDate = new Date(appointment.appointmentDate).toDateString();
const formattedStartTime = convertTo12HourFormat(appointment.startTime);
const formattedEndTime = convertTo12HourFormat(appointment.endTime);

    const reminderMethod = 'email';
    const emailMessage = `<p>Dear patient,</p>
                          <p>This is a reminder for your appointment on <b>${formattedAppoinmentDate}</b> at <b>${formattedStartTime}</b>.</p>`;

    try {
      await mail(appointment.patient.email,
         'Appointment Reminder', emailMessage);

      await Reminder.create({
        appointmentId: appointment.id,
        status: 'sent',
        method: reminderMethod,
      });

      return res.status(200).json({
        message: "Reminder sent successfully",
      });
    } catch (emailError) {
      await Reminder.create({
        appointmentId: appointment.id,
        status: 'failed',
        method: reminderMethod,
      });

      return res.status(400).json({
        message: "Failed to send reminder",
      //  error: emailError.message,
      });
    }
  } catch (error) {    
    return res.status(400).json({
      message:"Error sending patient reminder"
    })
  }
}

const getPatientReminders = async (req, res) => {
  try {
    const patientId = req.user.id; 
    let reminders;
    if(req.user.role === "doctor"){
      reminders = await Reminder.findAll({
        include: [
          {
            model: Appointment,
            where: {
              doctorId: req.user.id,
            },
            include: [
              {
                model: User,
                as: 'doctor',
                attributes: ['id', 'name'],
              },
              {
                model: User,
                as: 'patient',
                attributes: ['id', 'name'],
              },
              {
                model: AppointmentType,
                attributes: ['name'],
              },
            ],
          },
        ],
      });
    }else if(req.user.role === "user"){
      reminders = await Reminder.findAll({
         include: [
           {
             model: Appointment,
             where: {
               patientId: patientId,
             },
             include: [
               {
                 model: User,
                 as: 'doctor',
                 attributes: ['id', 'name'],
               },
               {
                 model: User,
                 as: 'patient',
                 attributes: ['id', 'name'],
               },
               {
                 model: AppointmentType,
                 attributes: ['name'],
               },
             ],
           },
         ],
       });
    }
    else if(req.user.role === "admin"){

      reminders = await Reminder.findAll({
        include: [
          {
            model: Appointment,            
            include: [
              {
                model: User,
                as: 'doctor',
                attributes: ['id', 'name'],
              },
              {
                model: User,
                as: 'patient',
                attributes: ['id', 'name'],
              },
              {
                model: AppointmentType,
                attributes: ['name'],
              },
            ],
          },
        ],
      });

    }
    return res.status(200).json(reminders);
  } catch (error) {
    return res.status(400).json({
      message: "Error fetching reminders",     
    });
  }
};

const getAllUsersAsPatients = async(req, res) =>{
  try {
    const users = await User.findAll({
      attributes:["id", "name"]
    })
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({
      message:"Error in fetching patients"
    })
  }
}

const getPatientAppointmentsByDate = async (req, res) => {
  try {
     const { patientId, appointmentDate } = req.query; 
    // Validate and parse the date in DD-MM-YYYY format
      if (!appointmentDate) {
        return res.status(400).json({ message: 'appointmentDate is required' });
      }
      if (!patientId) {
        return res.status(400).json({ message: 'patientId is required' });
      }
      const parsedDate = formatDateToBackend(appointmentDate); 
      if(!parsedDate){
        return res.status(400).json({ message: 'Invalid Date' });
      }

    // Query appointments by patientId and appointmentDate
    const appointments = await Appointment.findAll({
      where: {
        patientId: patientId,
        // appointmentDate: parsedDate, 
        appointmentDate: {
          [Op.eq]: parsedDate // Using Sequelize operator to match exact date
        }
      },
      include: [
        // {
        //   model: User,
        //   as: 'doctor',
        //   attributes: ['id', 'name'],
        // },
        {
          model: AppointmentType,
          attributes: ['name'],
        },
      ],
    });
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(400).json({
      message: "Error fetching patient appointments by date"     
    });
  }
};

const  bookAppointmentByDoctor = async (req,res)=>{
  try {
    let {doctorId, patientId, appointmenttypeId, appointmentDate, startTime, endTime, specialty } = req.body;
   
      if(!patientId){
        return res.status(400).json({
            message:"patientId field required"
        })
    }   

    if(!doctorId){
        return res.status(400).json({
            message:"doctorId field required"
        })
    } 
    if(!appointmenttypeId){
        return res.status(400).json({
            message:"appointmenttypeId field required"
        })
    }    
    
    if(!appointmentDate){
      return res.status(400).json({
          message:"appointmentDate field required"
      })
  }
    
    if(!startTime){
        return res.status(400).json({
            message:"startTime field is required"
        })
    }
  
    if(!endTime){
      return res.status(400).json({
          message:"endTime field is required"
      })
    }
    if(!specialty){
      return res.status(400).json({
          message:"specialty field required"
      })
  }
  const  patient = await User.findOne({
    where:{
      id:patientId
    }
   }); 

    // check for doctor role
      const doctor = await User.findOne({
        where:{id:doctorId,}
      });
      if(!doctor){
          return res.status(400).json({
              message:"Doctor Not Found"
          })
      }
      if(doctor.role !== "doctor"){
          return res.status(400).json({
              message:"This user is not a doctor"
          })
      }
      const appointmenttype = await AppointmentType.findOne({
        where:{id:appointmenttypeId}
    });
    if(!appointmenttype){
        return res.status(400).json({
            message:"appointment type not found"
        })
    }
    const doctorspecialty = await DoctorSpecialty.findOne({where:{userId:doctor.id, 
        specialty 
    }});
    if(!doctorspecialty){
        return res.status(400).json({
            message:`User not specialised in ${specialty}`
        })
    }
  
    
  // convert start and end time to 24 hours for saving to db
  startTime = convertTo24HourFormat(startTime);
  // endTime = convertTo24HourFormat(endTime);
  if(!startTime){
    return res.status(400).json({ message: 'Invalid startTime string format'});
  }
  endTime = convertTo24HourFormat(endTime);
  if(!endTime){
    return res.status(400).json({ message: 'Invalid endTime string format'});
  }
  
    // continue with booking logic
  
   // Check if the appointment already exists
   const existingAppointment = await Appointment.findOne({
    where: {
      doctorId:doctor.id,
      appointmentDate,
      appointmenttypeId,
      specialty,
      startTime,
      endTime
    }
  });
  
  
  if (existingAppointment) {
    return res.status(400).json({ 
      message: 'An appointment at this time already exists for this provider.' });
  }
  
  // Create the new appointment
  const newAppointment = await Appointment.create({
    doctorId:doctor.id,
    patientId:patient.id,
    appointmenttypeId,
    appointmentDate,
    startTime,
    endTime,
    specialty
  });
  
  
  const formattedDateString = new Date(newAppointment.appointmentDate).toDateString();
  const formattedStartTime = convertTo12HourFormat(newAppointment.startTime);
  const formattedEndTime  = convertTo12HourFormat(newAppointment.endTime);
  // Compose email messages
  const doctorSubject = 'Appointment Scheduled';
  const doctorMessage = `Dear Dr. ${doctor.name},\n\nYou have a new appointment scheduled with Patient ${patient.name} on ${formattedDateString} at ${formattedStartTime} - ${formattedEndTime}.\n\nRegards,\nMedSched`;
  const patientSubject = 'Appointment Confirmation';
  const patientMessage = `Dear ${patient.name},\n\nYour appointment with Dr. ${doctor.name} is scheduled on ${formattedDateString} at ${formattedStartTime} - ${formattedEndTime}.\n\nRegards,\nMedSched`;
  
  // Send emails to both doctor and patient
    await Promise.all([
    mail(doctor.email, doctorSubject, doctorMessage).catch(error => {
      console.error('Error sending email to doctor:', error);
    }),
    mail(patient.email, patientSubject, patientMessage).catch(error => {
      console.error('Error sending email to patient:', error);
    })
  ]);

   // Return success response to client
  return res.status(201).json({ 
  message: 'Appointment booked successfully',
  newAppointment,
  });
  
    
  } catch (error) {   
    return res.status(400).json({
      message:"Error in booking appointment",    
    })
  }
 }

  const cancelAppointment = async(req, res)=> {
    const {appointmentId} = req.body; 
    const userId = req.user.id;     
    try {

      // validate appointmentId
      if(!appointmentId){
        return res.status(400).json({ message: 'appointmentId field required' });
      }
      // Attempt to find the appointment
      const appointment = await Appointment.findByPk(appointmentId);  
      if (!appointment) {
        return res.status(400).json({ message: 'Appointment not found' });
      }
      // Determine if the user is the doctor
    let doctorId = req.user.role === "doctor" ? req.user.id : null;

    // Check if the logged-in user is the owner of the appointment or the doctor assigned to the appointment
    if (appointment.patientId !== userId && appointment.doctorId !== doctorId) {
      return res.status(403).json({ message: 'Unauthorized Action' });
    }
    // Cancel the appointment
    await appointment.update({        
      status: "cancelled"
    });
    return  res.status(200).json({
        message: "Appointment Cancelled Successfully"
    }); 
    } catch (error) {     
     return    res.status(400).json({ message: 'Failed to cancel appointment' });
    }
}


// const patientDashboardReports = async(req,res)=>{
//   try {
//     const userId = req.user.id;
//     const appointmentDate =  new Date().toISOString().slice(0, 10);
//     const currentDate = formatDateToBackend(appointmentDate);

//     const appointments = await Appointment.findAll({
//       where: {
//        patientId: userId, 
//         appointmentDate: {
//           [Op.eq]: currentDate,
//         },
//         status: 'scheduled'
//       },
      
//     });
//     const completedAppointments = await Appointment.findAll({
//       where: {
//        patientId: userId,
//        status: 'completed'
//       },      
//     });

// // Fetch reminders count
// const remindersCount = await Reminder.count({
//   include: [
//     {
//       model: Appointment,
//       where: {
//         patientId: userId,
//       },
//     },
//   ],
// });

// // medical history count 

// const prescriptionsCount = await MedicalHistory.count({
//   where: { patientId: userId }
// });

//     // Count the number of upcoming appointments
//     const upcomingCount = appointments.length;
//     const completed = completedAppointments.length;    
//     return res.status(200).json({     
//       upcomingCount,
//       completed,      
//       remindersCount,
//       prescriptionsCount
//     });
    
//   } catch (error) {     
//     return res.status(400).json({
//       message:"Error in fetching dashboard reports"
//     })
//   }
// }

const patientDashboardReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let appointments = [];
    let completedAppointments = [];
    let remindersCount = 0;
    let prescriptionsCount = 0;

    if (userRole === 'user') {
      // Fetching data for patients
      const appointmentDate = new Date().toISOString().slice(0, 10);
      const currentDate = formatDateToBackend(appointmentDate);

      appointments = await Appointment.findAll({
        where: {
          patientId: userId,
          appointmentDate: {
            [Op.eq]: currentDate,
          },
          status: 'scheduled',
        },
      });

      completedAppointments = await Appointment.findAll({
        where: {
          patientId: userId,
          status: 'completed',
        },
      });

      remindersCount = await Reminder.count({
        include: [
          {
            model: Appointment,
            where: {
              patientId: userId,
            },
          },
        ],
      });

      prescriptionsCount = await MedicalHistory.count({
        where: { patientId: userId },
      });

    } else if (userRole === 'doctor') {
      // Fetching data for doctors
      appointments = await Appointment.findAll({
        where: {
          doctorId: userId,
          status: 'scheduled',
        },
      });

      completedAppointments = await Appointment.findAll({
        where: {
          doctorId: userId,
          status: 'completed',
        },
      });

      remindersCount = await Reminder.count({
        include: [
          {
            model: Appointment,
            where: {
              doctorId: userId,
            },
          },
        ],
      });
      
      prescriptionsCount = await MedicalHistory.count({
        where: { doctorId: userId },
      });
    }  
    else if(req.user.role === "admin"){
      // Fetching data for admin
      appointments = await Appointment.findAll({
        where: {       
          status: 'scheduled',
        },
      });

      completedAppointments = await Appointment.findAll({
        where: {          
          status: 'completed',
        },
      });

      remindersCount = await Reminder.count({
        include: [
          {
            model: Appointment,
            
          },
        ],
      });
      
      prescriptionsCount = await MedicalHistory.count();
    } 
    
    else {
      return res.status(403).json({ message: 'Unauthorized user role' });
    }

    // Count the number of upcoming and completed appointments
    const upcomingCount = appointments.length;
    const completed = completedAppointments.length;

    return res.status(200).json({
      upcomingCount,
      completed,
      remindersCount,
      prescriptionsCount,
    });

  } catch (error) {   
    return res.status(400).json({
      message: "Error in fetching dashboard reports"
    });
  }
}




module.exports = {
    getAllAppointments,
    getAuthUserAppointments,
    deleteMyAppointment,
    deleteAppointmentByAdmin,  
    getDoctorsBySpecialty,
    rescheduleAppointment,
    getDoctorAppointments,
    bookAppointment,
    getPatientsByAppointmentDate,
    getDoctorsSpecialties,
    sendPatientReminder,
    getPatientReminders,
    getAllUsersAsPatients,
    getPatientAppointmentsByDate,
    bookAppointmentByDoctor,
    cancelAppointment,
    patientDashboardReports,
    
}