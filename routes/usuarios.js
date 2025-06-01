const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  registrarUsuario,
  loginUsuario,
  listarUsuarios
} = require('../controllers/usuarioController');

// Registro de nuevo usuario
router.post('/registro', registrarUsuario);

// Inicio de sesión
router.post('/login', loginUsuario);

// Listado de usuarios (requiere token)
router.get('/', auth, listarUsuarios);

router.get('/verificar/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    usuario.verificado = true;
    await usuario.save();

    res.send("✅ Cuenta verificada correctamente. Ya puedes iniciar sesión.");
  } catch (err) {
    console.error(err);
    res.status(400).send("Token inválido o expirado");
  }
});


module.exports = router;

