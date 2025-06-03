const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const urlBase = 'https://api-para-sistema-git-estructura-modular-vargoskys-projects.vercel.app';

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

// POST /api/reenviar-verificacion
router.post('/reenviar-verificacion', async (req, res) => {
  try {
    const { email } = req.body;

    // Verifica que el email se haya recibido
    if (!email) {
      return res.status(400).json({ error: 'Email es requerido' });
    }

    // Busca al usuario en la base de datos
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.verificado) {
      return res.status(400).json({ error: 'Usuario ya está verificado' });
    }

    // Genera un nuevo token
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Arma el enlace de verificación
    const enlace = `https://api-para-sistema-git-estructura-modular-vargoskys-projects.vercel.app/api/usuarios/verificar/${token}`;

    // Envía el correo (usa tu función ya existente de envío)
    await enviarCorreoVerificacion(usuario.email, enlace);

    res.json({ mensaje: 'Correo de verificación reenviado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al reenviar el correo' });
  }
});


module.exports = router;

