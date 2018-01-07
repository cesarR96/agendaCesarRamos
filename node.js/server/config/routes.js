'use strict';

var ObjectId = require('mongodb').ObjectID;

const usuario = require('../models/usuario');
const evento = require('../models/evento');

module.exports = (app, db) => {

    const Usuario = new usuario(db);
    const Evento = new evento(db);

    app.get('/', (req, res) => {
        res.sendFile('index.html');
    });

    app.post('/login', (req, res) => {

        Usuario.verificaUsuario(req.body, (error, respuesta) => {
            if (error)
                throw error;
            else if (respuesta) {
                app.locals.id = respuesta._id;
                res.send('Validado');
            }
            else
                res.send('Error');
        });
    });

    app.get('/events/all', (req, res) => {
        if(typeof(app.locals.id) === 'undefined') {
            res.send('0');
        }
        else {
            Evento.recibirEventos(ObjectId(app.locals.id), (error, respuesta) => {
                if (error)
                    throw error;
                else
                    res.json(respuesta);
            });
        }
    });
    
    app.post('/events/new', (req, res) => {
        req.body.nomusu = ObjectId(app.locals.id);
        if (req.body.end == "") delete req.body.end;

        Evento.agregarEvento(req.body, (error, respuesta) => {
            if (error)
                throw error;
            else
                res.json(respuesta);
        });
    });

    app.post('/events/update/:id', (req, res) => {
        Evento.actualizarEvento(ObjectId(req.body.id), req.body, (error, respuesta) => {
            console.log('update', respuesta);
        });
    });

    app.post('/events/delete/:id', (req, res) => {
        Evento.eliminarEvento(ObjectId(req.body.id), (error, respuesta) => {
            console.log('delete', respuesta);
        });
    });
};