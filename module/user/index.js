const express  = require('express');
const path     = require('path');

const routes     = require('./routes');

const user = express();

user.set('views', path.join(__dirname, 'views'));
user.set('view engine', 'pug');

user.on('mount', app => {
    user.locals = Object.assign(app.locals, user.locals);
});

user.use(routes);

module.exports = user;