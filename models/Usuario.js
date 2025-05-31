// models/Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  password: String,
  verificado: { type: Boolean, default: false },
});

module.exports = mongoose.model('Usuario', usuarioSchema);

