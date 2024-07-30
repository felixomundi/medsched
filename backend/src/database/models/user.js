'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {     
      this.hasMany(models.Token, {
        foreignKey: 'userId',       
      })       
      this.hasMany(models.Appointment, {
        foreignKey:"doctorId",
        as:"doctor",
      })
      this.hasMany(models.Appointment, {
        as:"patient",
        foreignKey:"patientId"
      })     
      User.hasMany(models.DoctorSpecialty, { foreignKey: 'userId', as: 'specialties' });
      User.hasMany(models.MedicalHistory, {
        foreignKey: 'doctorId',
      //  as: 'doctorMedicalHistories',
      });

      User.hasMany(models.MedicalHistory, {
        foreignKey: 'patientId',
   //     as: 'patientMedicalHistories',
      });
    }   
  }
 
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      defaultValue: "+254712345678",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        notEmpty: true,
      },
    },
    password: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    gender: DataTypes.ENUM('Male', 'Female', 'Other'),
    dob:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
async function generateHash(user) {
    if (user === null) {
        throw new Error('User is null');
    }
    else if (!user.changed('password')) return user.password;
    else {
        let salt = bcrypt.genSaltSync(10);
        return user.password = bcrypt.hashSync(user.password, salt);
    }
}
User.beforeCreate(generateHash);
User.beforeUpdate(generateHash);
  return User;
};