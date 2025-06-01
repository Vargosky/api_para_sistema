const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  registrarUsuario,
  loginUsuario,
  listarUsuarios
} = require('../controllers/usuarioController');

// Registro de nuevo usuario
router.post('/registro', registrarUsuario);

// Inicio de sesión
router.post('/login', loginUsuario);

// Listado de usuarios (requiere token)
router.get('/', auth, listarUsuarios);

module.exports = router;

