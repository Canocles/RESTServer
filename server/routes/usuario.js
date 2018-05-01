const express = require('express')
const Usuario = require('../models/usuario')
const { verificarToken, verificarRol } = require('../middlewares/auth')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const app = express()

app.get('/usuarios', verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde)

    let hasta = req.query.limite || 5;
    hasta = Number(hasta)

    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde)
        .limit(hasta)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, cont) => {
                return res.status(200).json({
                    ok: true,
                    cuantos: cont,
                    usuarios
                })
            })
        })
})

app.post('/usuarios', [verificarToken, verificarRol], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        return res.status(201).json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.put('/usuarios/:id', [verificarToken, verificarRol], function(req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.delete('/usuarios/:id', [verificarToken, verificarRol], function(req, res) {
    let id = req.params.id

    let cambiarEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, deleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!deleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        return res.status(200).json({
            ok: true,
            usuario: deleted
        })
    })
})

module.exports = app