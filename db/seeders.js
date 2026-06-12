require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Usuario, Publicacion, Imagen, Comentario, Valoracion, Seguidor, Etiqueta, PublicacionEtiqueta } = require('../models');

async function seeders() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la BD...');

    await PublicacionEtiqueta.destroy({ where: {} });
    await Etiqueta.destroy({ where: {} });
    await Valoracion.destroy({ where: {} });
    await Comentario.destroy({ where: {} });
    await Imagen.destroy({ where: {} });
    await Publicacion.destroy({ where: {} });
    await Seguidor.destroy({ where: {} });
    await Usuario.destroy({ where: {} });

    console.log('Tablas limpiadas...');

    const hash = await bcrypt.hash('123456', 10);

    const admin = await Usuario.create({ username: 'admin', email: 'admin@fotaza.com', password: hash, rol: 'admin', activo: true });
    const validador = await Usuario.create({ username: 'validador', email: 'validador@fotaza.com', password: hash, rol: 'validador', activo: true });
    const user1 = await Usuario.create({ username: 'juan', email: 'juan@fotaza.com', password: hash, rol: 'usuario', activo: true });
    const user2 = await Usuario.create({ username: 'maria', email: 'maria@fotaza.com', password: hash, rol: 'usuario', activo: true });

    console.log('Usuarios creados...');

    const [animales] = await Etiqueta.findOrCreate({ where: { nombre: 'animales' } });
    const [mascotas] = await Etiqueta.findOrCreate({ where: { nombre: 'mascotas' } });
    const [aves] = await Etiqueta.findOrCreate({ where: { nombre: 'aves' } });

    const pub1 = await Publicacion.create({ titulo: 'La gallina del vecino', descripcion: 'Una gallina muy fotogénica.', usuario_id: user1.id, activa: true, comentarios_abiertos: true });
    const img1 = await Imagen.create({ publicacion_id: pub1.id, url: '/uploads/gallina.jpeg', licencia: 'sin_copyright', marca_agua: null });
    await PublicacionEtiqueta.create({ publicacion_id: pub1.id, etiqueta_id: animales.id });
    await PublicacionEtiqueta.create({ publicacion_id: pub1.id, etiqueta_id: aves.id });

    const pub2 = await Publicacion.create({ titulo: 'El gallo del barrio', descripcion: 'Este gallo se cree modelo.', usuario_id: user2.id, activa: true, comentarios_abiertos: true });
    const img2 = await Imagen.create({ publicacion_id: pub2.id, url: '/uploads/gallo2.jpeg', licencia: 'copyright', marca_agua: '© Maria 2026' });
    await PublicacionEtiqueta.create({ publicacion_id: pub2.id, etiqueta_id: aves.id });

    const pub3 = await Publicacion.create({ titulo: 'Mi hamster', descripcion: 'El hamster más tierno del mundo.', usuario_id: user1.id, activa: true, comentarios_abiertos: true });
    const img3 = await Imagen.create({ publicacion_id: pub3.id, url: '/uploads/hamster.jpeg', licencia: 'sin_copyright', marca_agua: null });
    await PublicacionEtiqueta.create({ publicacion_id: pub3.id, etiqueta_id: mascotas.id });

    const pub4 = await Publicacion.create({ titulo: 'Pugzilla ataca de nuevo', descripcion: 'El pug más famoso de la ciudad.', usuario_id: user2.id, activa: true, comentarios_abiertos: true });
    const img4 = await Imagen.create({ publicacion_id: pub4.id, url: '/uploads/pugzilla.jpeg', licencia: 'sin_copyright', marca_agua: null });
    await PublicacionEtiqueta.create({ publicacion_id: pub4.id, etiqueta_id: mascotas.id });
    await PublicacionEtiqueta.create({ publicacion_id: pub4.id, etiqueta_id: animales.id });

    const pub5 = await Publicacion.create({ titulo: 'Hamster cholo', descripcion: 'El hamster más cholo del barrio.', usuario_id: user1.id, activa: true, comentarios_abiertos: true });
    const img5 = await Imagen.create({ publicacion_id: pub5.id, url: '/uploads/hamster_cholo.jpeg', licencia: 'sin_copyright', marca_agua: null });
    await PublicacionEtiqueta.create({ publicacion_id: pub5.id, etiqueta_id: mascotas.id });

    const pub6 = await Publicacion.create({ titulo: 'Mi tia', descripcion: 'Una foto de mi tia.', usuario_id: user2.id, activa: true, comentarios_abiertos: true });
    const img6 = await Imagen.create({ publicacion_id: pub6.id, url: '/uploads/mi_tia.jpg', licencia: 'sin_copyright', marca_agua: null });
    await PublicacionEtiqueta.create({ publicacion_id: pub6.id, etiqueta_id: animales.id });

    console.log('Publicaciones creadas...');

    await Comentario.create({ publicacion_id: pub1.id, usuario_id: user2.id, texto: '¡Qué gallina más linda!' });
    await Comentario.create({ publicacion_id: pub2.id, usuario_id: user1.id, texto: 'Ese gallo me despertó esta mañana.' });
    await Comentario.create({ publicacion_id: pub3.id, usuario_id: user2.id, texto: 'Los hamsters son lo mejor!' });
    await Comentario.create({ publicacion_id: pub4.id, usuario_id: user1.id, texto: 'Pugzilla es mi héroe.' });
    await Comentario.create({ publicacion_id: pub5.id, usuario_id: user2.id, texto: 'Ese hamster tiene mucho estilo.' });
    await Comentario.create({ publicacion_id: pub6.id, usuario_id: user1.id, texto: 'Hermosa foto!' });

    console.log('Comentarios creados...');

    await Valoracion.create({ imagen_id: img1.id, usuario_id: user2.id, valor: 5 });
    await Valoracion.create({ imagen_id: img2.id, usuario_id: user1.id, valor: 5 });
    await Valoracion.create({ imagen_id: img3.id, usuario_id: user2.id, valor: 4 });
    await Valoracion.create({ imagen_id: img4.id, usuario_id: user1.id, valor: 5 });
    await Valoracion.create({ imagen_id: img5.id, usuario_id: user2.id, valor: 5 });
    await Valoracion.create({ imagen_id: img6.id, usuario_id: user1.id, valor: 4 });

    console.log('Valoraciones creadas...');

    await Seguidor.create({ seguidor_id: user1.id, seguido_id: user2.id });
    await Seguidor.create({ seguidor_id: user2.id, seguido_id: user1.id });
    await Seguidor.create({ seguidor_id: user1.id, seguido_id: admin.id });

    console.log('Seguidores creados...');
    console.log('✅ Seeders ejecutados correctamente');
    console.log('-----------------------------------');
    console.log('Usuarios de prueba (contraseña: 123456)');
    console.log('admin@fotaza.com - rol: admin');
    console.log('validador@fotaza.com - rol: validador');
    console.log('juan@fotaza.com - rol: usuario');
    console.log('maria@fotaza.com - rol: usuario');

    process.exit(0);
  } catch (error) {
    console.error('Error en seeders:', error);
    process.exit(1);
  }
}

seeders();