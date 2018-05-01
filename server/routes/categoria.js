const express = require('express');

let { verificarToken, verificarRol } = require('../middlewares/auth');

let app = express();

let Categoria = require('../models/categoria');


app.get('/categorias', verificarToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count((err, cont) => {
                return res.status(200).json({
                    ok: true,
                    cuantos: cont,
                    categorias
                });
            });
        });

});

app.get('/categorias/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let usuarioId = req.usuario._id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            categoria: {
                id: categoria._id,
                descripcion: categoria.descripcion,
                usuario: categoria.usuario
            }
        });
    });

});

app.post('/categorias', verificarToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, saved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!saved) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha podido guardar'
                }
            });
        }

        return res.status(201).json({
            ok: true,
            categoria: saved
        });
    });
});

app.put('/categorias/:id', verificarToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, updated) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!updated) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        }

        return res.status(200).json({
            ok: true,
            categoria: updated
        })
    });
});

app.delete('/categorias/:id', [verificarToken, verificarRol], (req, res) => {
    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err, deleted) => {
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
                    message: 'Categoría no encontrada'
                }
            })
        }

        return res.status(200).json({
            ok: true,
            deleted: true
        })
    });
});

module.exports = app;