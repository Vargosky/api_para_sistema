const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

// 🛡️ Habilitar CORS
app.use(cors({
  origin: ['https://generador-rubricas-ia.vercel.app'], // frontend permitido
}));

app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch(err => console.error('🔴 Error al conectar a MongoDB:', err));

mongoose.connection.once('open', () => {
  console.log('🧠 Base de datos conectada a:', mongoose.connection.name);
});

// Importar rutas
const usuariosRoutes = require('../routes/usuarios');

// Redirección de la raíz
app.get('/', (req, res) => {
  res.redirect('https://generador-rubricas-ia.vercel.app/');
});

// Usar rutas
app.use('/api/usuarios', usuariosRoutes);

// Ruta pública de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: 'API operativa desde Vercel + MongoDB' });
});

// Servidor local (solo en desarrollo)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor local en http://localhost:${PORT}`);
  });
}

module.exports = app;
