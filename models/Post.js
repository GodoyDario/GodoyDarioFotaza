const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Post', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    descripcion: { type: DataTypes.TEXT, defaultValue: null },
    activa: { type: DataTypes.BOOLEAN, defaultValue: true },
    comentarios_abiertos: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: 'publicaciones', timestamps: true });
};