'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reminders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
         model: 'Appointments',         
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    sentAt: {
      type:Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    method:{
      type: Sequelize.STRING,
      allowNull:false,
    }, 
    status: {
      type: Sequelize.ENUM('sent', 'failed'),
      defaultValue: 'sent',
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
    await queryInterface.dropTable('Reminders');
  }
};