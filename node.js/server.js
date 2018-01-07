'use strict';

const express = require('express'),
    app = express(),
    MongoClient = require('mongodb').MongoClient;

const PORT = process.env.PORT || 3000;
const config = {
    rootPath : __dirname
};

MongoClient.connect('mongodb://localhost/agenda', (err, db) => {
    if (err) throw err;
    console.log('Base de Datos AGENDA iniciada correctamente...');

    require('./server/config/express')(app, config);
    require('./server/config/routes')(app, db);

    app.listen(PORT, () => { console.log(`Servidor funcionando en el puerto ${PORT}`); });
});
