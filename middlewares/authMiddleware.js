exports.EstaAutenticado = (req, res, next) => {
  if (req.session && req.session.usuario) {
    return next();
  }
  res.redirect('/auth/login');
};