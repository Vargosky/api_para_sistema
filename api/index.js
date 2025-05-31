const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch(err => console.error('🔴 Error al conectar a MongoDB:', err));

// Confirmar nombre de la base conectada (opcional)
mongoose.connection.once('open', () => {
  console.log('🧠 Base de datos conectada a:', mongoose.connection.name);
});

// Importar rutas
const usuariosRoutes = require('../routes/usuarios');

// Usar rutas
app.use('/api/usuarios', usuariosRoutes);

// Ruta pública de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: 'API operativa desde Vercel + MongoDB' });
});

// Escuchar localmente solo si se ejecuta con node
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor local en http://localhost:${PORT}`);
  });
}

// Exportar para que Vercel lo use como función serverless
module.exports = app;
