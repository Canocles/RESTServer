const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Uusario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });

    // Tipos permitidos
    let tipos = ['productos', 'usuarios'];
    if (tipos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tipos.join(', '),
                tipo
            }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    // Extensiones permitidas
    let extensiones = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensiones.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensiones.join(', '),
                extension
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivoCompuesto = `${id}~${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivoCompuesto}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Imagen cargada, ya podemos cambiar la imagen del perfil.
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivoCompuesto);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivoCompuesto);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Uusario.findById(id, (err, usuario) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuario) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borrarArchivo(usuario.img, 'usuarios');

        usuario.img = nombreArchivo;
        usuario.save((err, saved) => {
            res.json({
                ok: true,
                usuario: saved,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, producto) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borrarArchivo(producto.img, 'productos');

        producto.img = nombreArchivo;
        producto.save((err, saved) => {
            res.json({
                ok: true,
                producto: saved,
                img: nombreArchivo
            });
        });
    });
}

function borrarArchivo(nombreArchivo, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;