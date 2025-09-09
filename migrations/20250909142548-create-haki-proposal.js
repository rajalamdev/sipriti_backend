'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HakiProposals', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      judul: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bidang_fokus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tahun_pelaksanaan: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status_usulan: {
        type: Sequelize.ENUM('Pending', 'Approved', 'Declined'),
        allowNull: false,
        defaultValue: 'Pending'
      },
      status_dana: {
        type: Sequelize.ENUM('Didanai', 'Tidak Didanai'),
        allowNull: false,
        defaultValue: 'Tidak Didanai'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HakiProposals');
  }
};
