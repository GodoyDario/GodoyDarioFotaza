const { sequelize, Publicacion, Imagen, Comentario, Usuario, Valoracion, Etiqueta, PublicacionEtiqueta } = require('../models');

exports.mostrarFormulario = (req, res) => {
  res.render('publicaciones/crear', { error: null, datosCompletados: {} });
};

exports.guardarPublicacion = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { titulo, descripcion, licencia, marca_agua, etiquetas } = req.body;
    const usuario_id = req.session.usuario.id;
    const cloudinary = require('../config/cloudinary');

    if (!req.files || req.files.length === 0) {
      await t.rollback();
      return res.render('publicaciones/crear', { error: 'Debés subir al menos una imagen', datosCompletados: req.body });
    }

    const nuevaPublicacion = await Publicacion.create({
      titulo, descripcion, usuario_id, activa: true, comentarios_abiertos: true
    }, { transaction: t });

    for (const file of req.files) {
      const resultado = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'fotaza' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      await Imagen.create({
        publicacion_id: nuevaPublicacion.id,
        url: resultado.secure_url,
        licencia: licencia || 'sin_copyright',
        marca_agua: licencia === 'copyright' ? marca_agua : null
      }, { transaction: t });
    }

    if (etiquetas) {
      const listaEtiquetas = etiquetas.split(',').map(e => e.trim().toLowerCase()).filter(e => e);
      for (const nombre of listaEtiquetas) {
        const [etiqueta] = await Etiqueta.findOrCreate({ where: { nombre }, transaction: t });
        await PublicacionEtiqueta.create({
          publicacion_id: nuevaPublicacion.id,
          etiqueta_id: etiqueta.id
        }, { transaction: t });
      }
    }

    await t.commit();
    res.redirect('/');

  } catch (error) {
    await t.rollback();
    console.error('Error al guardar publicación:', error);
    res.render('publicaciones/crear', { error: 'Error al guardar: ' + error.message, datosCompletados: req.body });
  }
};

exports.verDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioLogueado = req.session.usuario || null;

    const publicacion = await Publicacion.findByPk(id, {
      include: [
        { model: Imagen, as: 'imagenes' },
        { model: Usuario, as: 'autor', attributes: ['id', 'username', 'avatar'] },
        {
          model: Comentario, as: 'comentarios',
          include: [{ model: Usuario, as: 'autor', attributes: ['id', 'username', 'avatar'] }],
          order: [['createdAt', 'ASC']]
        },
        { model: Etiqueta, as: 'etiquetas' }
      ]
    });

    if (!publicacion) return res.status(404).send('Publicación no encontrada');

    const tieneProtegidas = publicacion.imagenes.some(img => img.licencia === 'copyright');
    if (tieneProtegidas && !usuarioLogueado) return res.redirect('/auth/login');

    for (const imagen of publicacion.imagenes) {
      const valoraciones = await Valoracion.findAll({ where: { imagen_id: imagen.id } });
      imagen.dataValues.promedio = valoraciones.length > 0
        ? (valoraciones.reduce((sum, v) => sum + v.valor, 0) / valoraciones.length).toFixed(1)
        : null;
      imagen.dataValues.totalVotos = valoraciones.length;

      if (usuarioLogueado) {
        const yaValoro = valoraciones.find(v => v.usuario_id === usuarioLogueado.id);
        imagen.dataValues.miValoracion = yaValoro ? yaValoro.valor : null;
      }
    }

    res.render('publicaciones/detalle', { publicacion, usuario: usuarioLogueado });

  } catch (error) {
    console.error('Error al ver detalle:', error);
    res.status(500).send('Error interno: ' + error.message);
  }
};

exports.agregarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;
    const usuario_id = req.session.usuario.id;

    if (!texto || texto.trim() === '') return res.redirect(`/publicaciones/${id}`);

    const publicacion = await Publicacion.findByPk(id);
    if (!publicacion || !publicacion.comentarios_abiertos) {
      return res.status(400).send('Los comentarios están cerrados');
    }

    await Comentario.create({ publicacion_id: id, usuario_id, texto: texto.trim() });
    res.redirect(`/publicaciones/${id}`);

  } catch (error) {
    console.error('Error al comentar:', error);
    res.status(500).send('Error al publicar comentario');
  }
};

exports.valorarImagen = async (req, res) => {
  try {
    const { imagen_id } = req.params;
    const { valor } = req.body;
    const usuario_id = req.session.usuario.id;

    const imagen = await Imagen.findByPk(imagen_id, {
      include: [{ model: Publicacion, as: 'publicacion' }]
    });

    if (!imagen) return res.redirect('/');
    if (imagen.publicacion.usuario_id === usuario_id) {
      return res.redirect(`/publicaciones/${imagen.publicacion.id}`);
    }

    const yaValoro = await Valoracion.findOne({ where: { imagen_id, usuario_id } });
    if (yaValoro) return res.redirect(`/publicaciones/${imagen.publicacion.id}`);

    await Valoracion.create({ imagen_id, usuario_id, valor: parseInt(valor) });
    res.redirect(`/publicaciones/${imagen.publicacion.id}`);

  } catch (error) {
    console.error('Error al valorar:', error);
    res.status(500).send('Error al valorar imagen');
  }
};