'use strict';
const bcrypt = require("bcrypt")
const { v4 } = require("uuid")
const {
  Model
} = require('sequelize');
const { hashPassword } = require("../lib/hash");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static maxPassword = 16
    static minPassword = 8
    static maxUsername = 16
    static minUsername = 4
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role"
      })

      User.belongsToMany(models.HakiProposal, {
        through: models.MemberProposal,
        foreignKey: 'user_id',
        as: 'proposals'
      });
      
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: [User.minUsername, User.maxUsername],
          msg: `Password len must be between ${User.minUsername} and ${User.maxUsername} characters`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidLength(value) {
          // Jika password sudah di-hash (bcrypt = 60 karakter), lewati validasi panjang
          if (value && value.length !== 60) {
            if (value.length < User.minPassword || value.length > User.maxPassword) {
              throw new Error(`Password len must be between ${User.minPassword} and ${User.maxPassword} characters`);
            }
          }
        }
      }
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password){
          user.password = await hashPassword(user.password)
        }

        if (!user.role_id){
          const roleStaff = await sequelize.models.Role.findOne({
            where: {
              name: "mahasiswa"
            }
          })

          user.role_id = roleStaff.id
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await hashPassword(user.password)
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};