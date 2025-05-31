const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  registrarUsuario,
  loginUsuario,
  listarUsuarios
} = require('../controllers/usuarioController');

router.post('/', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/', auth, listarUsuarios);

module.exports = router;
