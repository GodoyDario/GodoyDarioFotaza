const { Usuario, Publicacion, Imagen, Seguidor } = require('../models');

exports.verPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioLogueado = req.session.usuario || null;

    const perfil = await Usuario.findByPk(id, {
      attributes: ['id', 'username', 'avatar', 'createdAt']
    });

    if (!perfil) return res.status(404).send('Usuario no encontrado');

    const publicaciones = await Publicacion.findAll({
      where: { usuario_id: id, activa: true },
      include: [{ model: Imagen, as: 'imagenes' }],
      order: [['createdAt', 'DESC']]
    });

    const seguidores = await Seguidor.count({ where: { seguido_id: id } });
    const seguidos = await Seguidor.count({ where: { seguidor_id: id } });

    let yaSigue = false;
    if (usuarioLogueado && usuarioLogueado.id !== parseInt(id)) {
      const relacion = await Seguidor.findOne({
        where: { seguidor_id: usuarioLogueado.id, seguido_id: id }
      });
      yaSigue = !!relacion;
    }

    res.render('usuarios/perfil', {
      perfil,
      publicaciones,
      seguidores,
      seguidos,
      yaSigue,
      usuario: usuarioLogueado
    });

  } catch (error) {
    console.error('Error al ver perfil:', error);
    res.status(500).send('Error interno: ' + error.message);
  }
};

exports.seguir = async (req, res) => {
  try {
    const seguido_id = parseInt(req.params.id);
    const seguidor_id = req.session.usuario.id;

    if (seguidor_id === seguido_id) {
      return res.redirect(`/usuarios/${seguido_id}`);
    }

    const yaExiste = await Seguidor.findOne({ where: { seguidor_id, seguido_id } });
    if (!yaExiste) {
      await Seguidor.create({ seguidor_id, seguido_id });
    }

    res.redirect(`/usuarios/${seguido_id}`);

  } catch (error) {
    console.error('Error al seguir:', error);
    res.status(500).send('Error al seguir usuario');
  }
};

exports.dejarDeSeguir = async (req, res) => {
  try {
    const seguido_id = parseInt(req.params.id);
    const seguidor_id = req.session.usuario.id;

    await Seguidor.destroy({ where: { seguidor_id, seguido_id } });

    res.redirect(`/usuarios/${seguido_id}`);

  } catch (error) {
    console.error('Error al dejar de seguir:', error);
    res.status(500).send('Error al dejar de seguir');
  }
};