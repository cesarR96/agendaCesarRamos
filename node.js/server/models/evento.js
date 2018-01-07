'use strict';

module.exports = function(db) {

    const Eventos = db.collection('eventos');

    this.recibirEventos = (id, callback) => {

        Eventos.find({nomusu: id}).toArray((err, docs) => {
            if (err) 
                callback(err);
            else
                callback(null, docs);
        });
    };

    this.actualizarEvento = (id, reg, callback) => {
        Eventos.findOneAndUpdate({_id: id}, {$set: {start: reg.ini, end: reg.fin}}, (err, doc) => {
            if (err)
                callback(err);
            else
                callback(null, {resultado: doc.ok});
        });
    };

    this.agregarEvento = (doc, callback) => {

        Eventos.insert(doc, (err, doc) => {
            if (err)
                callback(err);
            else
                callback(null, {id: doc.insertedIds[0], total: doc.insertedCount});
        });
    };

    this.eliminarEvento = (id, callback) => {
        Eventos.remove({_id: id}, (err, doc) => {
            if (err)
                callback(err);
            else
                callback(null, doc.result);
        });
    };
};
