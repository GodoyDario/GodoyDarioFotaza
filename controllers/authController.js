const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

exports.mostrarLogin = (req, res) => {
  if (req.session.usuario) return res.redirect('/');
  res.render('login', { error: null });
};

exports.mostrarRegistro = (req, res) => {
  if (req.session.usuario) return res.redirect('/');
  res.render('registro', { error: null });
};

exports.procesarRegistro = async (req, res) => {
  const { username, email, password, confirmar_password } = req.body;

  try {
    if (password !== confirmar_password) {
      return res.render('registro', { error: 'Las contraseñas no coinciden' });
    }

    const existente = await Usuario.findOne({
      where: { [Op.or]: [{ username }, { email }] }
    });

    if (existente) {
      return res.render('registro', { error: 'El usuario o email ya existe' });
    }

    const hash = await bcrypt.hash(password, 10);

    await Usuario.create({ username, email, password: hash });

    res.redirect('/auth/login');

  } catch (error) {
    console.error('Error en registro:', error);
    res.render('registro', { error: 'Error al registrar usuario' });
  }
};

exports.procesarLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuarioEncontrado = await Usuario.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }]
      }
    });

    if (!usuarioEncontrado) {
      return res.render('login', { error: 'Credenciales inválidas' });
    }

    if (!usuarioEncontrado.activo) {
      return res.render('login', { error: 'Tu cuenta está inactiva' });
    }

    const coincidePassword = await bcrypt.compare(password, usuarioEncontrado.password);

    if (!coincidePassword) {
      return res.render('login', { error: 'Contraseña incorrecta' });
    }

    req.session.usuario = {
      id: usuarioEncontrado.id,
      username: usuarioEncontrado.username,
      email: usuarioEncontrado.email,
      rol: usuarioEncontrado.rol,
      avatar: usuarioEncontrado.avatar
    };

    res.redirect('/');

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).render('login', { error: 'Error del servidor' });
  }
};

exports.cerrarSesion = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send('Error al cerrar sesión');
    res.redirect('/');
  });
};