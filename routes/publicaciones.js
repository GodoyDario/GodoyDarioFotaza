const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { EstaAutenticado } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
    const esValido = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
    if (esValido) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
}).array('imagenes', 10);

router.get('/crear', EstaAutenticado, postController.mostrarFormulario);

router.post('/crear', EstaAutenticado, (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.render('publicaciones/crear', {
          error: 'La imagen es demasiado pesada. Máximo 8 MB.',
          datosCompletados: req.body
        });
      }
      return res.render('publicaciones/crear', { error: `Error de carga: ${err.message}` });
    } else if (err) {
      return res.render('publicaciones/crear', { error: err.message });
    }
    postController.guardarPublicacion(req, res, next);
  });
});

router.post('/imagen/:imagen_id/valorar', EstaAutenticado, postController.valorarImagen);

router.get('/:id', postController.verDetalle);

router.post('/:id/comentar', EstaAutenticado, postController.agregarComentario);

module.exports = router;