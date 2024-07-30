'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AppointmentType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     
    }
  }
  AppointmentType.init({
    name: {
      type: DataTypes.STRING,
      unique:true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),  // DECIMAL type with precision of 10 and scale of 2
      allowNull: false,      
      get() {
        const rawValue = this.getDataValue('cost');
        if (rawValue == null) {
          return null; // Handle null case or return some default value
        }
        return parseFloat(rawValue).toFixed(2);
      },
    },
  }, {
    sequelize,
    modelName: 'AppointmentType',
  });
  return AppointmentType;
};