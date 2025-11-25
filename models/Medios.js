const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MediosSchema = new Schema({
    nombre: String,
    tipo: String,
    url: String,
    contacto: String,
    activo: Boolean
})

module.exports = mongoose.model('Medios', MediosSchema)