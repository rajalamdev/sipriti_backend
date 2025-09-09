'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MemberProposals', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      haki_proposal_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'HakiProposals',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      peran: {
        type: Sequelize.ENUM('Ketua', 'Anggota'),
        allowNull: false,
        defaultValue: 'Anggota'
      },
      status_invite: {
        type: Sequelize.ENUM('Pending', 'Accepted', 'Declined'),
        allowNull: false,
        defaultValue: 'Pending'
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
    await queryInterface.dropTable('MemberProposals');
  }
};
