const mongoose = require('mongoose');


const unidadSchema = new Schema({
    planId:  { type:Schema.Types.ObjectId, ref:"Plan", index:true },
    titulo:  String,
    semanas: Number,
    objetivos:String ,          // markdown / texto corto
  });


module.exports = mongoose.model('Unidad', unidadSchema)