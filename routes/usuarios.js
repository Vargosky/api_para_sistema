const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

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

router.get('/verificar/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    usuario.verificado = true;
    await usuario.save();

    res.send("✅ Cuenta verificada correctamente. Ya puedes iniciar sesión.");
  } catch (err) {
    console.error(err);
    res.status(400).send("Token inválido o expirado");
  }
});

router.get('/test-email', async (req, res) => {
  try {
    // Transporter de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configuración del correo
    const mailOptions = {
      from: `"Sistema de Prueba" <${process.env.EMAIL_USER}>`,
      to: "vargosky@gmail.com", // reemplázalo por uno tuyo para probar
      subject: "✅ Sistema funcionando",
      text: "Este es un correo de prueba enviado desde la API. Todo está bien.",
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    res.json({ mensaje: "✅ Correo de prueba enviado correctamente" });
  } catch (err) {
    console.error("❌ Error al enviar el correo:", err);
    res.status(500).json({ error: "Error al enviar el correo" });
  }

});


module.exports = router;

