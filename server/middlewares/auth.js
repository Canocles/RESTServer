const jwt = require('jsonwebtoken');

// =======================
// Verificar Token
// =======================
let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El Token no es válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// =======================
// Verificar Rol
// =======================
let verificarRol = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no tiene permisos de administrador'
            }
        });
    }
    next();
};

let verificarTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El Token no es válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificarToken,
    verificarRol,
    verificarTokenImg
}