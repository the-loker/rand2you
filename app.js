const express       = require('express');
const logger        = require('morgan');
const favicon       = require('serve-favicon');
const session       = require('express-session');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const MongoStore    = require('connect-mongo')(session);
const validator     = require('express-validator');
const useragent     = require('express-useragent');
const flash         = require('req-flash');

//const tasks         = require('./tasks');
const config        = require('./configs');
const services      = require('./services');
const middleware    = require('./middleware');
const libs          = require('./libs');

const main          = require('./module/main');
const user          = require('./module/user');
const admin         = require('./module/admin');
const api           = require('./module/api');

const app           = express();

app.set('view engine', 'pug');
app.set('views', config.paths.views);
app.set('config', config);
app.set('port', config.port);

app.locals.commission = config.commission; // Комиссия сервиса, для расчетов в шаблонах
app.locals.siteName = services.config.get('siteName'); // Имя сайта
app.locals.titleSeparator = services.config.get('titleSeparator'); // Расделитель имени сайта и названия страници
app.locals.basedir = config.paths.views; // Путь к основному шаблону
app.locals.moment = libs.moment; // Библиотека Moments для работы с датами в шаблонах

app.use(express.static(config.paths.public));
app.use(favicon(config.paths.favicon));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(validator({ customValidators: libs.validator } ));
app.use(logger('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    key: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days
    },
    store: new MongoStore({
        mongooseConnection: services.mongoose.connection,
        stringify: false,
        transformId: services.mongoose.Types.ObjectId(),
        ttl: 60 * 60 * 24 * 3, // 3 days
        touchAfter: 60 * 60 * 24 // 1 day
    })
}));
app.use(flash({ locals: 'flash' }));

app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

});

app.use(useragent.express());
app.use(middleware.partner.setPartnerCookie);
app.use(middleware.auth.loadUserData);
app.use('/', main);
app.use('/user', middleware.auth.checkAutorize, user);
app.use('/admin', middleware.auth.checkAutorize, admin);
app.use('/api', api);

app.use(middleware.error.notFound);
app.use(app.get('env') === 'development' ? middleware.error.development : middleware.error.production);

module.exports = app;