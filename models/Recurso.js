//model/Recurso.js

const mongoose = require('mongoose');

const recursoSchema = new Schema({
    planId:      { type:Schema.Types.ObjectId, ref:"Plan", index:true },
    nombre:String,
    unidad:String,                // "Unidad 2" | "General"
    descripcion:String,
    costo:     Number,
    fuente:    String,
    disponible:Boolean,
  });

module.exports = mongoose.model('Recurso', recursoSchema);