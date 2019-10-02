
const models = require('../../../models');
const middleware = require('../../../middleware');

module.exports = {

    getUser: async (req, res, next) => {

        req.checkParams('id', 'Incorrect link!').isObjectId();

        if(req.validationErrors(true)) {

            return next(middleware.error.create(404, 'Page not found.' ));

        }

        try {

            req.getUser = await models.User.findById(req.params.id);

            if(!req.getUser) return next(middleware.error.create(404, 'Page not found.' ));

            next();

        } catch(err) {

            next(err);

        }

    },

    show: {

        user: (req, res) => {

            res.render('user', {

                title: 'Профиль пользователя ' + req.getUser.login,
                userShow: req.getUser

            });

        },

        home: (req, res) => {

            res.render('home', {

                title: req.user.login

            });

        }

    }

};