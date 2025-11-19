const Usuario = require('../models/Usuario')
const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config')

function generarToken(usuario) {
    return jwt.sign(
        { 
            id: usuario._id, 
            email: usuario.email,
            rol: usuario.rol 
        },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    )
}

//Registrar usuario
async function registrarUsuario(req, res) {
    try {
        const { 
            nombre, 
            apellido, 
            email, 
            contrasena, 
            telefono 
        } = req.body

        if (!nombre || !apellido || !email || !contrasena ) {
            return res.status(400).send({ message: 'Faltan datos obligatorios' });
        }

        const usuarioExiste = await Usuario.findOne({ email })
        if (usuarioExiste) {
            return res.status(400).send({ message: 'El email ya está en uso' });
        }

        const usuario = Usuario ({
            nombre,
            apellido,
            email,
            contrasena,
            telefono,
            rol: 'usuario'
        })

        const usuarioGuardado = await usuario.save()
        const token = generarToken(usuarioGuardado)

        res.status(201).send({ 
            message: 'Usuario registrado exitosamente',
            usuario: usuarioGuardado,
            token
        })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

async function loginUsuario(req, res) {
    try {
        const { email, 
            contrasena 
        } = req.body

        if (!email || !contrasena) {
            return res.status(400).send({ message: 'Email y contraseña son obligatorios' })
        }

        const usuario =  await Usuario.findOne({ email })
        if (!usuario) {
            return  res.status(401).send({ message: 'Credenciales inválidas' })
        }

        if (!usuario.activo) {
            return res.status(403).send({ message: 'El usuario no está activo' })
        }

        const esContrasenaValida = await usuario.compararContrasena(contrasena)
        if (!esContrasenaValida) {
            return res.status(401).send({ message: 'Credenciales inválidas' })
        }

        const token = generarToken(usuario)

        res.status(200).send({ message: 'Inicio de sesión exitoso', usuario, token })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

async function obtenerPerfil(req, res) {
    try {
        res.status(200).send({ usuario: req.usuario })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

module.exports = {
    registrarUsuario,
    loginUsuario,
    obtenerPerfil
}