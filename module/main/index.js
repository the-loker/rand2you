const express  = require('express');
const path     = require('path');

const routes     = require('./routes/index');

const main = express();

main.set('views', path.join(__dirname, 'views'));
main.set('view engine', 'pug');

main.on('mount', app => {
    main.locals = Object.assign(app.locals, main.locals);
});

main.use(routes);

module.exports = main;