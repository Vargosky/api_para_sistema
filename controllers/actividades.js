/* controllers/actividades.js */
const Actividad = require('../models/Actividad');

/* ▸ Crear */
exports.crear = async (req, res) => {
  try {
    const nueva = await Actividad.create({ ...req.body, planId: req.usuario.idPlan ?? req.body.planId });
    res.status(201).json(nueva);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'No se pudo crear la actividad' });
  }
};

/* ▸ Listar (opcionalmente filtrar por planId / unidadId) */
exports.listar = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.planId)   filtro.planId   = req.query.planId;
    if (req.query.unidadId) filtro.unidadId = req.query.unidadId;

    const actividades = await Actividad.find(filtro).lean();
    res.json(actividades);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
};

/* ▸ Obtener una */
exports.obtener = async (req, res) => {
  try {
    const act = await Actividad.findById(req.params.id);
    if (!act) return res.status(404).json({ error: 'No existe' });
    res.json(act);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
};

/* ▸ Actualizar */
exports.actualizar = async (req, res) => {
  try {
    const upd = await Actividad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!upd) return res.status(404).json({ error: 'No existe' });
    res.json(upd);
  } catch (err) {
    res.status(400).json({ error: 'No se pudo actualizar' });
  }
};

/* ▸ Eliminar */
exports.eliminar = async (req, res) => {
  try {
    const del = await Actividad.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: 'No existe' });
    res.json({ mensaje: 'Actividad eliminada' });
  } catch (err) {
    res.status(400).json({ error: 'No se pudo eliminar' });
  }
};
