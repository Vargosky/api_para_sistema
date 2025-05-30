const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth');

dotenv.config();
const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch((err) => console.error('🔴 Error conectando a MongoDB:', err));

// Ruta de prueba pública
app.get('/api', (req, res) => {
  res.json({ mensaje: 'Hola desde la API serverless con MongoDB' });
});

// Registro de usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({ nombre, email, password: passwordHash });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Login de usuario
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
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

    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta protegida: perfil
app.get('/api/perfil', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

// Servidor local para desarrollo
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
