// api/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDatabase = require('../lib/db');
const usuariosRoutes = require('../routes/usuarios');

dotenv.config();

const app = express();

// 🛡️ Habilitar CORS
app.use(cors());
app.use(express.json());

// 🚀 Bootstrap para esperar la conexión y montar rutas
async function bootstrap() {
  try {
    await connectToDatabase(); // 👈 espera a que esté lista la base

    // Opcional: puedes mostrar a qué base se conectó
    const mongoose = require('mongoose');
    mongoose.connection.once('open', () => {
      console.log('🧠 Base de datos conectada a:', mongoose.connection.name);
    });

    // ✅ Rutas disponibles solo después de la conexión
    app.use('/api/usuarios', usuariosRoutes);

    // Ruta pública de prueba
    app.get('/api', (req, res) => {
      res.json({ mensaje: 'API operativa desde Vercel + MongoDB' });
    });

    // Redirección de la raíz
    app.get('/', (req, res) => {
      res.redirect('https://generador-rubricas-ia.vercel.app/');
    });

    // Solo si corres localmente
    if (require.main === module) {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`🚀 Servidor local en http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error('❌ Error al inicializar la app:', err);
  }
}

bootstrap();

module.exports = app;
