'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MemberProposal extends Model {
    static associate(models) {
      MemberProposal.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      MemberProposal.belongsTo(models.HakiProposal, { foreignKey: 'haki_proposal_id', as: 'proposal' });
    }
  }
  MemberProposal.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    haki_proposal_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    peran: {
      type: DataTypes.ENUM('Ketua','Anggota'),
      defaultValue: 'Anggota'
    },
    status_invite: {
      type: DataTypes.ENUM('Pending','Accepted','Declined'),
      defaultValue: 'Pending'
    }
  }, {
    sequelize,
    modelName: 'MemberProposal',
    tableName: 'MemberProposals'
  });
  return MemberProposal;
};
