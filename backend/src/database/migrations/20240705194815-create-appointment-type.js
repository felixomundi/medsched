'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AppointmentTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        unique:true,
      },
      description: {
        type: Sequelize.STRING,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AppointmentTypes');
  }
};