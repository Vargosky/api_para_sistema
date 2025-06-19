const express = require('express');
const auth    = require('../middleware/auth'); // si usas JWT
const ctrl    = require('../controllers/planes');

const router = express.Router();

/* Todas protegidas con auth */
router.get('/test',         ctrl.testPlan);
router.post('/',      auth, ctrl.crearPlan);
router.get('/',       auth, ctrl.listarPlanes);
router.get('/:id',    auth, ctrl.obtenerPlan);
router.put('/:id',    auth, ctrl.actualizarPlan);
router.delete('/:id', auth, ctrl.eliminarPlan);

module.exports = router;
