const express = require('express')
const { addMedio, getMedio } = require('../controllers/mediosController')
const api = express.Router()

//PÚBLICAS
api.get('/medios', getMedio)

//PROTEGIDAS
api.post('/medios', addMedio)

module.exports = api