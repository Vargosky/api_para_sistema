//model/Actividad.js
const mongoose = require('mongoose');

const actividadSchema = new Schema({
    planId:   { type:Schema.Types.ObjectId, ref:"Plan", index:true },
    nombre:   String,
    detalle:  String,
    tipo:     { type:String, enum:["regular","ludica"] },
  });



module.exports = mongoose('Actividad', actividadSchema);