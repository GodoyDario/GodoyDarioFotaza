const { Imagen, Publicacion, Usuario, Valoracion } = require('../models');
const { Op } = require('sequelize');

exports.index = async (req, res) => {
  try {
    const queryTerm = req.query.search ? req.query.search.trim() : '';
    const usuarioLogueado = req.session.usuario || null;

    let whereImagen = {};
    if (!usuarioLogueado) {
      whereImagen.licencia = 'sin_copyright';
    }

    let wherePost = { activa: true };
    if (queryTerm !== '') {
      wherePost[Op.or] = [
        { titulo: { [Op.iLike]: `%${queryTerm}%` } },
        { descripcion: { [Op.iLike]: `%${queryTerm}%` } }
      ];
    }

    const publicaciones = await Publicacion.findAll({
      where: wherePost,
      include: [
        {
          model: Imagen,
          as: 'imagenes',
          where: whereImagen,
          required: true
        },
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('index', {
      publicaciones,
      busqueda: queryTerm,
      usuario: usuarioLogueado
    });

  } catch (error) {
    console.error('Error al cargar home:', error);
    res.status(500).send('Error al cargar los datos: ' + error.message);
  }
};