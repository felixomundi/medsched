'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('Appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    appointmenttypeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
          model: 'AppointmentTypes',
          key: 'id',
          as :"appointmenttypeId"
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
  },
    appointmentDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },   
    startTime: {
      type: Sequelize.TIME,
      allowNull: false
  },
  endTime: {
      type: Sequelize.TIME,
      allowNull: false
  }, 
  available: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
  },
    status: {
        type: Sequelize.ENUM('scheduled', 'cancelled', 'completed'),
        defaultValue: 'scheduled'
    },
    specialty:{
      type:DataTypes.STRING,
      allowNull:false,
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
    await queryInterface.dropTable('Appointments');
  }
};