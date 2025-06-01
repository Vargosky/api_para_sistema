const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Espera un header: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = decoded; // Se puede usar luego en la ruta
    next();
  } catch (err) {
    console.error('❌ Error en autenticación:', err);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = auth;

