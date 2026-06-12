const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

// Importar modelos
const Usuario = require('./Usuario')(sequelize);
const Publicacion = require('./Post')(sequelize);
const Imagen = require('./Image')(sequelize);
const Comentario = require('./Comment')(sequelize);
const Valoracion = require('./Valoracion')(sequelize);
const Seguidor = require('./Seguidor')(sequelize);
const Etiqueta = require('./Etiqueta')(sequelize);
const PublicacionEtiqueta = require('./PublicacionEtiqueta')(sequelize);

// Relaciones
Usuario.hasMany(Publicacion, { foreignKey: 'usuario_id', as: 'publicaciones' });
Publicacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });

Publicacion.hasMany(Imagen, { foreignKey: 'publicacion_id', as: 'imagenes' });
Imagen.belongsTo(Publicacion, { foreignKey: 'publicacion_id', as: 'publicacion' });

Publicacion.hasMany(Comentario, { foreignKey: 'publicacion_id', as: 'comentarios' });
Comentario.belongsTo(Publicacion, { foreignKey: 'publicacion_id', as: 'publicacion' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });

Imagen.hasMany(Valoracion, { foreignKey: 'imagen_id', as: 'valoraciones' });
Valoracion.belongsTo(Imagen, { foreignKey: 'imagen_id', as: 'imagen' });
Valoracion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.belongsToMany(Usuario, {
  through: Seguidor,
  as: 'seguidos',
  foreignKey: 'seguidor_id',
  otherKey: 'seguido_id'
});
Usuario.belongsToMany(Usuario, {
  through: Seguidor,
  as: 'seguidores',
  foreignKey: 'seguido_id',
  otherKey: 'seguidor_id'
});

Publicacion.belongsToMany(Etiqueta, { through: PublicacionEtiqueta, as: 'etiquetas', foreignKey: 'publicacion_id' });
Etiqueta.belongsToMany(Publicacion, { through: PublicacionEtiqueta, as: 'publicaciones', foreignKey: 'etiqueta_id' });

module.exports = {
  sequelize,
  Usuario,
  Publicacion,
  Imagen,
  Comentario,
  Valoracion,
  Seguidor,
  Etiqueta,
  PublicacionEtiqueta
};