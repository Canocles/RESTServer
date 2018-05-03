const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Uusario = require('../models/usuario');

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

        return res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        });
    });
});

module.exports = app;