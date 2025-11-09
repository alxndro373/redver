const express = require('express')
const upload = require('../libs/storage')
const { addReporte, getReporte } = require('../controllers/reporteController')
const api = express.Router()

api.post('/reportes', upload.single('image'), addReporte)
api.get('/reportes', getReporte)

module.exports = api