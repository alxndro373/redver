const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DifusionesSchema = new Schema({
    reporte_id: String,
    medio_id: String,
    fecha_envio: Date,
    estado_envio: String,
    msj_publi: { type: Boolean, default: false }
})

module.exports = mongoose.model('Difusiones', DifusionesSchema)