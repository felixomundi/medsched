'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reminder.belongsTo(models.Appointment, {
        foreignKey: 'appointmentId',
      });
    }
  }
  Reminder.init({
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
       model: 'Appointments',         
          key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
    method:{
      type: DataTypes.STRING,
      allowNull:false,
    },    
    status: {
      type: DataTypes.ENUM('sent', 'failed'),
      defaultValue:   "sent"
      },
  }, {
    sequelize,
    modelName: 'Reminder',
  });
  return Reminder;
};