'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HakiProposal extends Model {
    static associate(models) {
      HakiProposal.belongsToMany(models.User, {
        through: models.MemberProposal,
        foreignKey: 'haki_proposal_id',
        as: 'members'
      });
    }
  }
  HakiProposal.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    judul: DataTypes.STRING,
    bidang_fokus: DataTypes.STRING,
    tahun_pelaksanaan: DataTypes.INTEGER,
    file_url: DataTypes.STRING,
    status_usulan: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Declined'),
      defaultValue: 'Pending'
    },
    status_dana: {
      type: DataTypes.ENUM('Didanai', 'Tidak Didanai'),
      defaultValue: 'Tidak Didanai'
    }
  }, {
    sequelize,
    modelName: 'HakiProposal',
    tableName: 'HakiProposals'
  });
  return HakiProposal;
};
