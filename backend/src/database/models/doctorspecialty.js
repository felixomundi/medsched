'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DoctorSpecialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DoctorSpecialty.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  DoctorSpecialty.init({
    userId: DataTypes.INTEGER,
    specialty: {
      type: DataTypes.STRING,
      allowNull:false,
    },
  }, {
    sequelize,
    modelName: 'DoctorSpecialty',
  });
  return DoctorSpecialty;
};