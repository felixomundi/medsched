'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MedicalHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MedicalHistory.belongsTo(models.Appointment, {
        foreignKey: 'appointmentId',
        as: 'appointment'
      });
      MedicalHistory.belongsTo(models.User, {
        foreignKey: 'doctorId',
        as: 'doctor'
      });
      MedicalHistory.belongsTo(models.User, {
        foreignKey: 'patientId',
        as: 'patient'
      });
    }
  }
  MedicalHistory.init({   
    appointmentId: DataTypes.INTEGER,
    visitDate: DataTypes.DATE,
    symptoms: DataTypes.TEXT,
    diagnosis: DataTypes.TEXT,
    medications: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    followUpDate: DataTypes.DATE,
    height: DataTypes.STRING,
    weight: DataTypes.STRING,
    bloodPressure: DataTypes.STRING,
    heartRate: DataTypes.STRING,
    allergies: DataTypes.TEXT,
    pastSurgeries: DataTypes.TEXT,
    familyHistory: DataTypes.TEXT,
    socialHistory: DataTypes.TEXT,
    diet: DataTypes.TEXT,
    exercise: DataTypes.TEXT,
    smoking: DataTypes.TEXT,
    alcohol: DataTypes.TEXT,
    doctorId:DataTypes.INTEGER,
    patientId:DataTypes.INTEGER,
   
  }, {
    sequelize,
    modelName: 'MedicalHistory',
  });
  return MedicalHistory;
};