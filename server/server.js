require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.json('Hello World')
})

app.get('/usuarios', function(req, res) {
    res.json('Get Usuarios')
})

app.post('/usuarios', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.json({
            usuario: body
        })
    }
})

app.put('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json(`Put Usuario ${id}`)
})

app.delete('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json(`Delete Usuario ${id}`)
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}.`);
})