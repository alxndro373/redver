const mongoose = require('mongoose')
const { appConfig } = require('../config')

const Schema = mongoose.Schema

const ReporteSchema = new Schema({
    usuario_id: String,
    titulo: String,
    descripcion: String,
    categoria: String,
    ubicacion: String,
    imgUrl: String,
    estado: String,
    validado_por: String,
}, { 
    timestamps: true 
})

ReporteSchema.methods.setImgUrl = function setImgUrl (filename) {
    const { host, port } = appConfig
    this.imgUrl = `${host}:${port}/public/${filename}`
}

module.exports = mongoose.model('Reporte', ReporteSchema)