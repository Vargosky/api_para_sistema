// models/Plan.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const planSchema = new Schema(
  {
    // Si `userId` apunta a la colección de usuarios, conviene usar ObjectId
    userId: {
      type: Schema.Types.ObjectId,  // usa String si no referencias otro doc
      ref: 'Usuario',
      required: true,
      index: true,
    },

    titulo: {
      type: String,
      trim: true,
    },

    tipo: {
      type: String,
      enum: ['anual', 'unidad', 'clase'],
      required: true,
    },

    asignatura: {
      type: String,
      trim: true,
    },

    fechaInicio: Date,
    fechaTermino: Date,

    estado: {
      type: String,
      enum: ['pendiente', 'activo', 'finalizado'],
      default: 'pendiente',
    },

    // ⬇️ Array de códigos de OA
    objetivos: {
      type: [String],   // equivalente a Array<String>
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
