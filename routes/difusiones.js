const express = require('express')
const { addDifusion, getDifusion } = require('../controllers/difusionesController')
const api = express.Router()

//PÚBLICAS
api.get('/difusiones', getDifusion)

//PROTEGIDAS
api.post('/difusiones', addDifusion)

module.exports = api