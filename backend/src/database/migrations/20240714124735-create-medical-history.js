'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MedicalHistories', {
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
      visitDate: {
        type: Sequelize.DATE
      },
      symptoms: {
        type: Sequelize.TEXT
      },
      diagnosis: {
        type: Sequelize.TEXT
      },
      medications: {
        type: Sequelize.TEXT
      },
      notes: {
        type: Sequelize.TEXT
      },
      followUpDate: {
        type: Sequelize.DATE
      },
      height: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.STRING
      },
      bloodPressure: {
        type: Sequelize.STRING
      },
      heartRate: {
        type: Sequelize.STRING
      },
      allergies: {
        type: Sequelize.TEXT
      },
      pastSurgeries: {
        type: Sequelize.TEXT
      },
      familyHistory: {
        type: Sequelize.TEXT
      },
      socialHistory: {
        type: Sequelize.TEXT
      },
      diet: {
        type: Sequelize.TEXT
      },
      exercise: {
        type: Sequelize.TEXT
      },
      smoking: {
        type: Sequelize.TEXT
      },
      alcohol: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('MedicalHistories');
  }
};