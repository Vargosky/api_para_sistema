const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectToDatabase = require('../lib/db');
const usuariosRoutes = require('../routes/usuarios');

dotenv.config();

const app = express();

// 🛡️ Habilitar CORS y parseo JSON
app.use(cors());
app.use(express.json());

async function bootstrap() {
  try {
    // 🔌 Esperar conexión a MongoDB
    await connectToDatabase();
    console.log('🧠 Conexión con MongoDB lista');

    // ✅ Rutas principales
    app.use('/api/usuarios', usuariosRoutes);

    // 🧪 Ruta de test
    app.get('/api', (req, res) => {
      res.json({ mensaje: '✅ API operativa desde Vercel + MongoDB Atlas' });
    });

    // 🌐 Redirección a frontend
    app.get('/', (req, res) => {
      res.redirect('https://generador-rubricas-ia.vercel.app/');
    });

    // 🔁 Ejecuta servidor local solo en desarrollo
    if (require.main === module) {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`🚀 Servidor local en http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error('❌ Error al inicializar la app:', err.message);
    process.exit(1);
  }
}

bootstrap();

module.exports = app;
