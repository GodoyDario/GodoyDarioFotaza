const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Valoracion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imagen_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    valor: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
  }, { tableName: 'valoraciones', timestamps: true });
};