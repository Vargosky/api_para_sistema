const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true // agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
