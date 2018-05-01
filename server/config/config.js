// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BBDD
let urlDB;

// Fecha de expiración del Token
process.env.TOKEN_EXPIRE = 60 * 60 * 24 * 10;

// Secret de autentificación
process.env.SECRET = process.env.SECRET || 'desarrollo';

// Prueba de entorno
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;