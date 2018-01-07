'use strict';

const logger = require('morgan'),
    bodyParser = require('body-parser'),
    express = require('express');

//exporto el modulo
module.exports = (app, config) => {

    app.use(logger('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(express.static(config.rootPath + '/public'));
};
