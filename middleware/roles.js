const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
const { jwtConfig } = require('../config')

async function verificarToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        
        if (!token) {
            return res.status(401).send({ message: 'No se proporcionó token de autenticación' })
        }

        const decoded = jwt.verify(token, jwtConfig.secret)
        const usuario = await Usuario.findById(decoded.id)

        if (!usuario || !usuario.activo) {
            return res.status(401).send({ message: 'Usuario no autorizado' })
        }

        req.usuario = usuario
        next()
    } catch (e) {
        return res.status(401).send({ message: 'Token inválido o expirado' })
    }
}

function verificarRol(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).send({ message: 'Usuario no autenticado' })
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).send({ message: 'No tienes permisos para acceder a este recurso' })
        }

        next()
    }
}

function verificarPropietarioOAdmin(modelName, idParam = 'id') {
    return async (req, res, next) => {
        try {
            const Model = require(`../models/${modelName}`)
            const recurso = await Model.findById(req.params[idParam])

            if (!recurso) {
                return res.status(404).send({ message: 'Recurso no encontrado' })
            }

            if (req.usuario.rol === 'admin') {
                return next()
            }

            //Verificar si es el propietario
            if (recurso.usuario?.toString() === req.usuario._id.toString()) {
                return next()
            }

            return res.status(403).send({ message: 'No tienes permisos para modificar este recurso' })
        } catch (e) {
            return res.status(500).send({ message: e.message })
        }
    }
}

module.exports = {
    verificarToken,
    verificarRol
}