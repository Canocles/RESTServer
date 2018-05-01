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

module.exports = {
    verificarToken
}