const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Seguidor', {
    seguidor_id: { type: DataTypes.INTEGER, allowNull: false },
    seguido_id: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'seguidores', timestamps: true });
};