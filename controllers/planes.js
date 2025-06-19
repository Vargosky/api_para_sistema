const Plan = require('../models/Plan');
const Usuario = require('../models/Usuario');

/* =========================================================
 * 📌 Crear nuevo plan
 * =======================================================*/
const crearPlan = async (req, res) => {
  try {
    const {
      userId,          // ObjectId del profesor/usuario
      titulo,
      tipo,
      asignatura,
      fechaInicio,
      fechaTermino,
      objetivos = [],
    } = req.body;

    // Validaciones mínimas
    if (!userId || !tipo || !objetivos.length) {
      return res.status(400).json({
        error: 'userId, tipo y al menos un objetivo son requeridos',
      });
    }

    // (Opcional) Verificar que el usuario exista
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const nuevoPlan = await Plan.create({
      userId,
      titulo,
      tipo,
      asignatura,
      fechaInicio,
      fechaTermino,
      objetivos,
    });

    res.status(201).json(nuevoPlan);
  } catch (err) {
    console.error('❌ Error al crear plan:', err);
    res.status(500).json({ error: 'Error al crear el plan' });
  }
};

/* =========================================================
 * 📌 Listar todos los planes
 * =======================================================*/
const listarPlanes = async (req, res) => {
  try {
    const planes = await Plan.find()
      .populate('userId', 'nombre email') // muestra datos básicos del creador
      .sort({ createdAt: -1 });

    res.json(planes);
  } catch (err) {
    console.error('❌ Error al listar planes:', err);
    res.status(500).json({ error: 'Error al obtener los planes' });
  }
};

/* =========================================================
 * 📌 Obtener plan por ID
 * =======================================================*/
const obtenerPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findById(id).populate('userId', 'nombre email');
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });

    res.json(plan);
  } catch (err) {
    console.error('❌ Error al obtener plan:', err);
    res.status(500).json({ error: 'Error al obtener el plan' });
  }
};

/* =========================================================
 * 📌 Actualizar plan
 * =======================================================*/
const actualizarPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const planActualizado = await Plan.findByIdAndUpdate(id, cambios, {
      new: true,
      runValidators: true,
    });

    if (!planActualizado)
      return res.status(404).json({ error: 'Plan no encontrado' });

    res.json(planActualizado);
  } catch (err) {
    console.error('❌ Error al actualizar plan:', err);
    res.status(500).json({ error: 'Error al actualizar el plan' });
  }
};

/* =========================================================
 * 📌 Eliminar plan
 * =======================================================*/
const eliminarPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const planEliminado = await Plan.findByIdAndDelete(id);
    if (!planEliminado)
      return res.status(404).json({ error: 'Plan no encontrado' });

    res.json({ mensaje: 'Plan eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar plan:', err);
    res.status(500).json({ error: 'Error al eliminar el plan' });
  }
};

// 📌 Test del endpoint
const testPlan = async (req, res) => {
  res.json({ mensaje: '✅ Endpoint de Plan funcionando correctamente' });
};

module.exports = {
  crearPlan,
  listarPlanes,
  obtenerPlan,
  actualizarPlan,
  eliminarPlan,
  testPlan
};
