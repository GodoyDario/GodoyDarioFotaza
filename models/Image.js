const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Image', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    publicacion_id: { type: DataTypes.INTEGER, allowNull: false },
    url: { type: DataTypes.STRING(255), allowNull: false },
    licencia: { type: DataTypes.ENUM('copyright', 'sin_copyright'), defaultValue: 'sin_copyright' },
    marca_agua: { type: DataTypes.STRING(255), defaultValue: null }
  }, { tableName: 'imagenes', timestamps: true });
};