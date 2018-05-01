const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Email o contraseña incorrectos.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Email o contraseña incorrectos.'
                }
            });
        }

        let token = jwt.sign({
            usuario
        }, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRE });

        res.status(200).json({
            ok: true,
            usuario,
            token
        });
    });
});

// Configuración de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuario) {
            if (!usuario.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de iniciar sesión con su usuario normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario
                }, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRE });

                return res.json({
                    ok: true,
                    usuario,
                    token
                });
            }
        } else {
            // Si el usuario no existe
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = bcrypt.hashSync(':) You join us with Google', 10);

            usuario.save((err, saved) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                } else {
                    let token = jwt.sign({
                        usuario
                    }, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRE });
                }

                return res.json({
                    ok: true,
                    usuario,
                    token
                });
            });
        }
    });
});


module.exports = app