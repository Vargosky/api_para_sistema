// controllers/actividades.js
const Actividad = require('../models/Actividad');

// 📌 Crear nueva actividad
const crearActividad = async (req, res) => {
  try {
    const planId = req.usuario?.idPlan ?? req.body.planId;

    const nuevaActividad = await Actividad.create({
      ...req.body,
      planId
    });

    res.status(201).json(nuevaActividad);
  } catch (err) {
    console.error('❌ Error al crear actividad:', err);
    res.status(400).json({ error: 'No se pudo crear la actividad' });
  }
};

// 📌 Listar actividades (puede filtrar por planId / unidadId)
const listarActividades = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.planId) filtro.planId = req.query.planId;
    if (req.query.unidadId) filtro.unidadId = req.query.unidadId;

    const actividades = await Actividad.find(filtro).lean();
    res.json(actividades);
  } catch (err) {
    console.error('❌ Error al listar actividades:', err);
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
};

// 📌 Obtener una actividad por ID
const obtenerActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id);

    if (!actividad) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    res.json(actividad);
  } catch (err) {
    console.error('❌ Error al obtener actividad:', err);
    res.status(400).json({ error: 'ID inválido o error al buscar la actividad' });
  }
};

// 📌 Actualizar una actividad
const actualizarActividad = async (req, res) => {
  try {
    const actualizada = await Actividad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!actualizada) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    res.json(actualizada);
  } catch (err) {
    console.error('❌ Error al actualizar actividad:', err);
    res.status(400).json({ error: 'No se pudo actualizar la actividad' });
  }
};

// 📌 Eliminar una actividad
const eliminarActividad = async (req, res) => {
  try {
    const eliminada = await Actividad.findByIdAndDelete(req.params.id);

    if (!eliminada) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    res.json({ mensaje: '✅ Actividad eliminada correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar actividad:', err);
    res.status(400).json({ error: 'No se pudo eliminar la actividad' });
  }
};

// 📌 Test del endpoint
const testActividades = async (req, res) => {
  res.json({ mensaje: '✅ Endpoint de actividades funcionando correctamente' });
};

module.exports = {
  crearActividad,
  listarActividades,
  obtenerActividad,
  actualizarActividad,
  eliminarActividad,
  testActividades
};
