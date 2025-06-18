// models/Usuario.js
const mongoose = require('mongoose');

const planSchema = new Schema({
  userId:  { type:String, required:true, index:true },
  titulo:  String,
  tipo:    { type:String, enum:["anual","unidad","clase"] },
  asignatura:String,
  fechaInicio: Date,
  fechaTermino: Date,
}, { timestamps:true });

module.exports = mongoose.model('Plan', planSchema);


