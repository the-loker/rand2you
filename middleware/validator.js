
const services = require('../services');

module.exports = {

    signin: async (req, res, next) => {

        req.checkBody('email', services.config.get('email.empty')).notEmpty();
        req.checkBody('email', services.config.get('email.format')).isEmail();

        req.checkBody('password', services.config.get('password.empty')).notEmpty();

        next();

    },

    signup: async (req, res, next) => {

        req.checkBody('login', services.config.get('login.empty')).notEmpty();
        req.checkBody('login', services.config.get('login.minlength')).isLength({ min: 3 });
        req.checkBody('login', services.config.get('login.maxlength')).isLength({ max: 20 });
        req.checkBody('login', services.config.get('login.regexp')).matches(/^(?!\s$)[a-z0-9]{3,20}$/);
        req.checkBody('login', services.config.get('login.used')).isUniqueLogin();
        req.checkBody('login', services.config.get('login.used')).rtrim();

        req.checkBody('email', services.config.get('email.empty')).notEmpty();
        req.checkBody('email', services.config.get('email.format')).isEmail();
        req.checkBody('email', services.config.get('email.used')).isUniqueEmail();

        req.checkBody('password', services.config.get('password.empty')).notEmpty();
        req.checkBody('password', services.config.get('password.minlength')).isLength({ min: 8 });

        req.checkBody('confirm', services.config.get('password.confirm')).equals(req.body.password);

        next();

    },

    restore: (req, res, next) => {

        req.checkBody('email', services.config.get('email.empty')).notEmpty();
        req.checkBody('email', services.config.get('email.format')).isEmail();
        req.checkBody('email', services.config.get('email.noEmail')).checkEmail();

        next();

    },

    support: (req, res, next) => {

        req.checkBody('email', services.config.get('email.empty')).notEmpty();
        req.checkBody('email', services.config.get('email.format')).isEmail();

        req.checkBody('theme', 'Не указана тема сообщения.').notEmpty();
        req.checkBody('text', 'Не указан текст сообщения.').notEmpty();

        next();

    },

    asyncGetErrors: async (req, res, next) => {

        await req.asyncValidationErrors(true)

            .catch(err => {

                if(req.errors) {

                    req.errors = Object.assign(err, req.errors);

                } else {

                    req.errors = err;

                }

            });

        next();

    },

    checkCaptcha: (req, res, next) => {

        if(req.recaptcha.error) {

            let data = {

                captcha: {

                    msg: services.config.get('captcha.fail')

                }

            };

            if(req.errors) {

                req.errors = Object.assign(data, req.errors);

            } else {

                req.errors = data;

            }

        }

        next();

    },



};