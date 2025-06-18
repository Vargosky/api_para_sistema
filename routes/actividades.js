const express = require('express');
const auth    = require('../middleware/auth');
const ctrl    = require('../controllers/actividades');

const router = express.Router();

/* Todas protegidas con auth */
router.post('/',        auth, ctrl.crear);
router.get('/',         auth, ctrl.listar);
router.get('/:id',      auth, ctrl.obtener);
router.put('/:id',      auth, ctrl.actualizar);
router.delete('/:id',   auth, ctrl.eliminar);

module.exports = router;
