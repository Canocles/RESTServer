const express = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const app = express()

app.get('/usuarios', function(req, res) {
    res.json('Get Usuarios')
})

app.get('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json(`Put Usuario ${id}`)
})

app.post('/usuarios', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
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

app.put('/usuarios/:id', function(req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.delete('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json(`Delete Usuario ${id}`)
})

module.exports = app