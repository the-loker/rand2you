const services     = require('../../../services');
const model        = require('../../../models');

module.exports = {

    checkCaptcha: (req, res, next) => {

        if(!req.user) {

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

        }

        next();

    },

    create: async (req, res, next) => {

        if(req.errors) return next();

        try {

            const data = await model.Support.create({
                userName: req.user.login ? req.user.login : 'Guest',
                email: req.user.email ? req.user.email : req.body.email,
                text: req.body.text,

            })

        } catch (err) {

            next(err);

        }

        next();

    },

    show: (req, res) => {

        res.render('support', {

            title: services.config.get('support.title'),
            captchaRender: res.recaptcha,
            errors: req.errors

        });

    }

};