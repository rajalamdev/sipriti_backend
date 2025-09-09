'use strict';

const { v4 } = require("uuid")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Roles', [
      {
       id: v4(),
       name: 'admin',
       createdAt: new Date(),
       updatedAt: new Date()
      },
      {
        id: v4(),
        name: 'dosen',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: v4(),
        name: 'mahasiswa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: v4(),
        name: 'berita',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Roles', null, {});
  }
};
