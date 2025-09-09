'use strict';
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Ambil id role admin dan staff
    const roles = await queryInterface.sequelize.query(
      'SELECT id, name FROM `Roles` WHERE name IN ("admin", "dosen", "mahasiswa", "berita")',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const adminRole = roles.find(r => r.name === 'admin');
    const dosenRole = roles.find(r => r.name === 'dosen');
    const mahasiswaRole = roles.find(r => r.name === 'mahasiswa');
    const beritanRole = roles.find(r => r.name === 'berita');

    // Hash password
    const adminPassword = await bcrypt.hash('admin123', 10);
    const dosenPassword = await bcrypt.hash('dosen123', 10);
    const mahasiswaPassword = await bcrypt.hash('mahasiswa123', 10);
    const beritaPassword = await bcrypt.hash('berita123', 10);
    

    await queryInterface.bulkInsert('Users', [
      {
       id: v4(),
        name: 'Admin Demo',
        username: 'admin',
        password: adminPassword,
        role_id: adminRole ? adminRole.id : null,
       createdAt: new Date(),
       updatedAt: new Date()
      },
      {
        id: v4(),
        name: 'Dosen Demo',
        username: 'dosen',
        password: dosenPassword,
        role_id: dosenRole ? dosenRole.id : null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: v4(),
        name: 'Mahasiswa Demo',
        username: 'mahasiswa',
        password: mahasiswaPassword,
        role_id: mahasiswaRole ? mahasiswaRole.id : null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: v4(),
        name: 'Berita Demo',
        username: 'berita',
        password: beritaPassword,
        role_id: beritanRole ? beritanRole.id : null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      username: ['admin', 'dosen', 'mahasiswa', 'berita']
    }, {});
  }
};
