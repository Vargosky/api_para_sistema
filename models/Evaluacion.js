// modelo de Evaluación

const mongoose = require('mongoose');

const evaluacionSchema = new Schema({
    planId:      { type:Schema.Types.ObjectId, ref:"Plan", index:true },
    nombre:      String,
    detalle:     String,
    fecha:       Date,
    instrumento: String,
    ponderacion: Number,
    cantidad:    Number,
  });


module.exports = mongoose.model('Evaluacion', evaluacionSchema);