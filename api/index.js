// api/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDatabase = require('../lib/db');
const usuariosRoutes = require('../routes/usuarios');
const actividadesRoutes = require('../routes/actividades');

dotenv.config();

const app = express();

// 🛡️ Habilitar CORS y parseo JSON
app.use(cors());
app.use(express.json());

// ✅ Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/actividades', actividadesRoutes);

// 🧪 Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: '✅ API operativa desde Vercel + MongoDB Atlas' });
});

// 🌐 Redirección a frontend
app.get('/', (req, res) => {
  res.redirect('https://generador-rubricas-ia.vercel.app/');
});

// 🔁 Ejecuta servidor local solo en desarrollo
if (require.main === module) {
  connectToDatabase().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor local en http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error('❌ Error al conectar en local:', err.message);
    process.exit(1);
  });
} else {
  // 👉 Exporta como función serverless para Vercel
  module.exports = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
  };
}

