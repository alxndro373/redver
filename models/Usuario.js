const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema

const usuarioSchema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    contrasena: { type: String, required: true },
    telefono: String,
    rol: { type: String, enum: ['usuario', 'admin', 'reportero'], default: 'usuario' },
    activo: { type: Boolean, default: true },
    token_recuperacion: String,
    token_recuperacion_expira: Date
}, {
    timestamps: true,
})

usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('contrasena')) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.contrasena = await bcrypt.hash(this.contrasena, salt)
        next()
    } catch (e) {
        next(e)
    }
})

usuarioSchema.methods.compararContrasena = async function (psswdInput) {
    return await bcrypt.compare(psswdInput, this.contrasena)
}

usuarioSchema.methods.toJSON = function () {
    const usuario = this.toObject()
    delete usuario.contrasena
    delete usuario.token_recuperacion
    delete usuario.token_recuperacion_expira
    return usuario
}

module.exports = mongoose.model('Usuario', usuarioSchema);
