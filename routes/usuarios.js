const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { EstaAutenticado } = require('../middlewares/authMiddleware');

router.get('/:id', usuarioController.verPerfil);
router.post('/:id/seguir', EstaAutenticado, usuarioController.seguir);
router.post('/:id/dejardeseguir', EstaAutenticado, usuarioController.dejarDeSeguir);

module.exports = router;