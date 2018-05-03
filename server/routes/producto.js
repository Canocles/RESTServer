const express = require('express');

let { verificarToken } = require('../middlewares/auth');

let app = express();

let Producto = require('../models/producto');

app.get('/productos', verificarToken, (req, res) => {
    let desde = req.query.desde;
    desde = Number(desde);
    let limite = req.query.limite;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.status(201).json({
                ok: true,
                productos
            });
        });
});

app.get('/productos/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });
        });
});

app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.status(201).json({
                ok: true,
                productos
            });
        });
});

app.post('/productos', verificarToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, saved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            producto: saved
        });
    })

});

app.put('/productos/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        producto.nombre = body.nombre;
        producto.precioUni = body.precioUni;
        producto.categoria = body.categoria;
        producto.disponible = body.disponible;
        producto.descripcion = body.descripcion;

        producto.save((err, saved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.status(201).json({
                ok: true,
                producto: saved
            });
        });
    });
});

app.delete('/productos/:id', (req, res) => {
    let id = req.params.id;

    let cambiarEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, deleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!deleted) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            producto: deleted
        })
    });
});

module.exports = app;