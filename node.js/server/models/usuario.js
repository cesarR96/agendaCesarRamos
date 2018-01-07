'use strict';

const bcrypt = require('bcrypt-nodejs');

module.exports = function(db) {

    const Usuarios = db.collection('usuarios');

    this.verificaUsuario = (reg, callback) => {
        let where = {nomusu: reg.user};

        Usuarios.findOne(where, (err, doc) => {
            if (err) 
                callback(err);
            else if (bcrypt.compareSync(reg.pass, doc.clave))
                callback(null, doc);
            else
                callback(null, false);
        });
    };
};
