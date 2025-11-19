const express = require('express')
const Usuario = require('../models/Usuario')
const { registrarUsuario, loginUsuario, obtenerPerfil } = require('../controllers/usuarioController')
const { verificarToken, verificarRol } = require('../middleware/roles')
const api = express.Router()

//Rutas publicas
api.post('/usuarios/registro', registrarUsuario)
api.post('/usuarios/login', loginUsuario)

//Rutas protegidas
api.get('/usuarios/perfil', verificarToken, obtenerPerfil)

//Rutas protegidas solo admin
api.get('/usuarios', verificarToken, verificarRol('admin'), async (req, res) => {
    try {
        const usuarios = await Usuario.find()
        res.status(200).send({ usuarios })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})


api.patch('/usuarios/:id/desactivar', verificarToken, verificarRol('admin'), async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { activo: false },
            { new: true }
        )
        res.status(200).send({ message: 'Usuario desactivado', usuario })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})

api.patch('usuarios/:id/rol', verificarToken, verificarRol('admin'), async (req, res) => {
    try {
        const { rol } = req.body
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { rol },
            { new: true }
        )
        res.status(200).send({ message: 'Rol actualizado', usuario })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
})   
//Rutas protegidas solo reportero

module.exports = api