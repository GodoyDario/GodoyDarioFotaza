const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('PublicacionEtiqueta', {
    publicacion_id: { type: DataTypes.INTEGER, allowNull: false },
    etiqueta_id: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'publicacion_etiquetas', timestamps: false });
};