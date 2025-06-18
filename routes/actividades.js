// routes/actividades.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  crearActividad,
  listarActividades,
  obtenerActividad,
  actualizarActividad,
  eliminarActividad,
  testActividades
} = require('../controllers/actividades');

// 🧪 Test del endpoint sin middleware
router.get('/test', testActividades);

// 📌 Crear nueva actividad
router.post('/', auth, crearActividad);

// 📌 Listar actividades (requiere token)
router.get('/', auth, listarActividades);

// 📌 Obtener actividad por ID
router.get('/:id', auth, obtenerActividad);

// 📌 Actualizar actividad por ID
router.put('/:id', auth, actualizarActividad);

// 📌 Eliminar actividad por ID
router.delete('/:id', auth, eliminarActividad);

module.exports = router;
