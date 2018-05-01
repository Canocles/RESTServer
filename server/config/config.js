// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BBDD
let urlDB;

// Prueba de entorno
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://admin:admin@ds261929.mlab.com:61929/heroku_gzfvsbbp';
}

process.env.URLDB = urlDB;