const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');


const {
  registrarUsuario,
  loginUsuario,
  listarUsuarios,
  verificarUsuario,
  testEmail
} = require('../controllers/usuarioController');

// Registro de nuevo usuario
router.post('/registro', registrarUsuario);

// Inicio de sesión
router.post('/login', loginUsuario);

// Listado de usuarios (requiere token)
router.get('/', auth, listarUsuarios);

router.get('/verificar/:token', verificarUsuario);

//funcion para probar el correo
router.get('/test-email', testEmail);


module.exports = router;

