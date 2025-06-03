const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const enviarCorreoVerificacion = require('../lib/email');

// 📌 Registrar nuevo usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      verificado: false
    });

    await nuevoUsuario.save();

    // 🔐 Generar token de verificación
    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const urlVerificacion = `https://api-para-sistema.vercel.app//api/usuarios/verificar/${token}`;

    // ✉️ Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"EduCommand" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confirma tu cuenta',
      html: `
        <h2>Hola ${nombre},</h2>
        <p>Gracias por registrarte. Por favor haz clic en el siguiente enlace para confirmar tu cuenta:</p>
        <a href="${urlVerificacion}" target="_blank">Verificar cuenta</a>
        <p>Este enlace expirará en 24 horas.</p>
      `
    });

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente. Revisa tu correo para confirmar tu cuenta.'
    });

  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// 📌 Iniciar sesión
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    if (!usuario.verificado) {
      return res.status(403).json({ error: 'Debes verificar tu correo antes de iniciar sesión' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (err) {
    console.error('❌ Error al iniciar sesión:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// 📌 Obtener todos los usuarios (sin contraseñas)
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (err) {
    console.error('❌ Error al listar usuarios:', err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

const verificarUsuario = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).send("Token no proporcionado.");
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(404).send("❌ Usuario no encontrado.");
    }

    if (usuario.verificado) {
      return res.send("✅ Tu cuenta ya estaba verificada.");
    }

    usuario.verificado = true;
    await usuario.save();

    return res.send("✅ Cuenta verificada correctamente. Ya puedes iniciar sesión.");
  } catch (err) {
    console.error("❌ Error al verificar token:", err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(400).send("⚠️ El enlace ha expirado. Solicita uno nuevo.");
    }

    return res.status(400).send("❌ Token inválido.");
  }
}

const testEmail = async (req, res) => async (req, res) => {
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
};

const reenviarCorreo = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email es requerido' });

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (usuario.verificado) return res.status(400).json({ error: 'Usuario ya está verificado' });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const enlace = `${process.env.BASE_URL || 'https://api-para-sistema.vercel.app'}/api/usuarios/verificar/${token}`;

    await enviarCorreoVerificacion(usuario.email, enlace);

    res.json({ mensaje: 'Correo de verificación reenviado correctamente' });
  } catch (error) {
    console.error('Error al reenviar:', error);
    res.status(500).json({ error: 'Error al reenviar el correo' });
  }
};



module.exports = {
  registrarUsuario,
  loginUsuario,
  listarUsuarios,
  verificarUsuario,
  testEmail,
  reenviarCorreo
};
