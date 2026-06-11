const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    avatar: { type: DataTypes.STRING(255), defaultValue: null },
    rol: { type: DataTypes.ENUM('usuario', 'validador', 'admin'), defaultValue: 'usuario' },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'usuarios', timestamps: true });
};