const express  = require('express');
const path     = require('path');

const routes = require('./routes/index');

const admin = express();

admin.set('views', path.join(__dirname, 'views'));
admin.set('view engine', 'pug');

admin.on('mount', app => {
    admin.locals = Object.assign(app.locals, admin.locals);
});

admin.use(routes);

module.exports = admin;