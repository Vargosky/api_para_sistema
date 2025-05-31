// api/index.js
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
    // 🔌 Conexión a MongoDB
    await connectToDatabase();

    // ✅ Rutas protegidas después de conectar a la BD
    app.use('/api/usuarios', usuariosRoutes);

    // 🧪 Ruta de prueba
    app.get('/api', (req, res) => {
      res.json({ mensaje: 'API operativa desde Vercel + MongoDB Atlas' });
    });

    // 🌐 Redirección a frontend
    app.get('/', (req, res) => {
      res.redirect('https://generador-rubricas-ia.vercel.app/');
    });

    // 🔁 Solo ejecuta servidor si estás en desarrollo (localhost)
    if (require.main === module) {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`🚀 Servidor local escuchando en http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error('❌ Error al inicializar la app:', err);
    process.exit(1); // sale si falla al conectar
  }
}

bootstrap();

module.exports = app;
