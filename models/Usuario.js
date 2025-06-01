// models/Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificado: { type: Boolean, default: false }
  },
  {
    timestamps: true // crea createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model('Usuario', usuarioSchema);


