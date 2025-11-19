const express = require('express')
const bodyParser = require('body-parser')
const reportesRoutes = require('./routes/reporte')
const usuarioRoutes = require('./routes/usuario')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public', express.static(`${__dirname}/storage/imgs`))

app.use('/v1', reportesRoutes)
app.use('/v1', usuarioRoutes)

module.exports = app
