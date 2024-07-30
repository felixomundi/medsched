'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appointment.belongsTo(models.User, {
        as: 'patient',
        foreignKey: 'patientId'
    });
    Appointment.belongsTo(models.User, {
        as: 'doctor',
        foreignKey: 'doctorId'
    });
    Appointment.belongsTo(models.AppointmentType,{
      foreignKey:"appointmenttypeId"});    
    Appointment.hasMany(models.Reminder, {
      foreignKey: 'appointmentId'
    });
    Appointment.hasMany(models.MedicalHistory, {
      foreignKey: 'appointmentId'
    });
    }
  }
  Appointment.init({
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'User',
          key: 'id'
      }
  },
  doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'User',
          key: 'id'
      }
  },
  appointmenttypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
   model: 'AppointmentType',  
   as :"appointmenttypeId",   
        key: 'id'
    }
},
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
},
startTime: {
  type: DataTypes.TIME,
  allowNull: false
},
endTime: {
  type: DataTypes.TIME,
  allowNull: false
},
available: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
status: {
  type: DataTypes.ENUM('scheduled', 'cancelled', 'completed'),
  defaultValue: 'scheduled'
},
specialty:{
  type:DataTypes.STRING,
  allowNull:false,
},
  },  

  {
    sequelize,
    modelName: 'Appointment',
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ['doctorId', 'appointmentDate', 'startTime']
    //   }
    // ],
  });  
  return Appointment;
};