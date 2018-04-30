const mongoose = require('mongoose')

let Schema = mongoose.Schema
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es un campo obligatorio.']
    },
    email: {
        type: String,
        required: [true, 'El correo es un campo obligatorio.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es un campo obligatorio.']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: "USER_ROLE"
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Usuario', usuarioSchema)