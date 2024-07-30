const {AppointmentType} = require("./../database/models");

async function createAppointmentType(req,res){
    try {
        const { name, description, duration, cost } = req.body;
        if(!name){
            return res.status(400).json({
                message:'name field is required'
            })
        }
        if(!duration){
            return res.status(400).json({
                message:'duration field is required'
            })
        }
        if(!cost){
            return res.status(400).json({
                message:'cost field is required'
            })
        }     

        // Check if duration is a number
    if (isNaN(duration)) {
      return res.status(400).json({ message: 'Duration must be a number.' });
    }

    // Optionally convert duration to integer if needed
   const durationInMinutes = parseInt(duration, 10); // Assuming duration is provided as a string

    // Validate cost
    if (!isValidCost(cost)) {
      return res.status(400).json({ message: 'Cost must be a valid decimal number.' });
    }

// Optionally convert cost to ensure it's stored with two decimal places
  const costInDecimal = parseFloat(cost).toFixed(2);   

  const exist = await AppointmentType.findOne({
      where:{name:name}
  });
  if(exist){
      return res.status(400).json({
          message:'Appointment type exist'
      })
  }
  const newAppointmentType = await AppointmentType.create({
      name,duration:durationInMinutes,cost:costInDecimal,description
  });
  return res.status(201).json({
      message:'Appointment type created successfully',
      data:newAppointmentType
  })   


    } catch (error) {      
        return res.status(400).json({
            message:"Internal Server Error",
        })
    }

}

// Get all AppointmentTypes
const getAllAppointmentTypes = async (req, res) => {
    try {
      const appointmentTypes = await AppointmentType.findAll();
      return res.status(200).json(appointmentTypes);
    } catch (error) {    
      return res.status(400).json({ message: 'Internal Server Error' });
    }
  };

  
// Delete an AppointmentType
const deleteAppointmentType = async (req, res) => {
    try {
      const { id } = req.params;
      const appointmentType = await AppointmentType.findOne({
        where:{id}
      });
      if (!appointmentType) {
        return res.status(400).json({ message: 'AppointmentType not found' });
      }
      await appointmentType.destroy();
      return res.status(200).json({
         message: 'AppointmentType Deleted Successfully',
         id:id,
      });
    } catch (error) {      
      return res.status(400).json({ message: 'Internal Server Error' });
    }
  };

// Get a single AppointmentType by ID
const getAppointmentTypeById = async (req, res) => {
    try {
      const { id } = req.params;
      const appointmentType = await AppointmentType.findOne({
        where:{id}
      });
      if (!appointmentType) {
        return res.status(400).json({ message: 'AppointmentType not found' });
      }
      return res.status(200).json(appointmentType);
    } catch (error) {
      console.error('Error fetching appointment type:', error);
     return res.status(400).json({ message: 'Internal Server Error' });
    }
  };

  

// Function to validate cost
const isValidCost = (cost) => {
  // Check if cost is a valid number
  if (isNaN(parseFloat(cost)) || parseFloat(cost) < 0) {
    return false;
  }
  return true;
};




const updateAppointmentType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, cost, duration } = req.body;

     // Validate duration
     if (duration !== undefined) {
      const parsedDuration = parseInt(duration, 10);
      if (isNaN(parsedDuration) || parsedDuration < 0) {
        return res.status(400).json({ error: 'Duration must be a non-negative integer.' });
      }
    }

    // Validate cost
    if (cost !== undefined && (isNaN(parseFloat(cost)) || parseFloat(cost) < 0)) {
      return res.status(400).json({ error: 'Cost must be a non-negative decimal number.' });
    }

    // Check if name is unique (if being updated)
    if (name !== undefined) {
      const existingAppointmentType = await AppointmentType.findOne({ where: { name } });
      if (existingAppointmentType && existingAppointmentType.id !== parseInt(id, 10)) {
        return res.status(400).json({ error: 'AppointmentType name must be unique.' });
      }
    }

    // Find AppointmentType by id
    const appointmentType = await AppointmentType.findByPk(id);
    if (!appointmentType) {
      return res.status(400).json({ message: 'AppointmentType not found.' });
    }

    // Update fields from request
    if (name !== undefined) {
      appointmentType.name = name;
    }
    if (description !== undefined) {
      appointmentType.description = description;
    }
    if (cost !== undefined) {
      appointmentType.cost = parseFloat(cost).toFixed(2);
    }
    if (duration !== undefined) {
      appointmentType.duration = parseInt(duration, 10); // Convert duration to integer
    }

    // Save updated AppointmentType
    await appointmentType.save();

  return  res.status(200).json({appointmentType, message:"Appointment Updated Successfully"});
  
  } catch (error) {   
    return res.status(400).json({ message: 'Internal Server Error' });
  }
};

module.exports ={
    createAppointmentType,
    getAllAppointmentTypes,
    deleteAppointmentType,
    getAppointmentTypeById,
    updateAppointmentType,
   
}