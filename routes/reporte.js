const express = require('express')
const upload = require('../libs/storage')
const { Reporte } = require('../models/Reporte')
const { addReporte, getReporte } = require('../controllers/reporteController')
const { verificarToken, verificarRol } = require('../middleware/roles')
const api = express.Router()

//PÚBLICAS
api.get('/reportes', getReporte)

//PROTEGIDAS
api.post('/reportes', verificarToken, upload.single('image'), addReporte)

//REPORTEROS/ADMIN
api.get('/reportes/pendientes', verificarToken, verificarRol('reportero', 'admin'), async (req, res) => {
    try {
        const reportesPendientes = await Reporte.find({ validado: false })
        res.status(200).send({ reportesPendientes })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

api.patch('/reportes/:id/validar', verificarToken, verificarRol('reportero', 'admin'), async (req, res) => {
    try {
        const reporte = await Reporte.findByIdAndUpdate(
            req.params.id,
            { validado: true},
            { new: true }
        )
        res.status(200).send({ message: 'Reporte validado', reporte })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

//ADMIN
api.delete('/reportes/:id', verificarToken, verificarRol('admin'), async (req, res) => {
    try {
        await Reporte.findByIdAndDelete(req.params.id)
        res.status(200).send({ message: 'Reporte eliminado' })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

module.exports = api