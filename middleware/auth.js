
const model = require('../models');

module.exports = {

    loadUserData: async (req, res, next) => {

        req.user = res.locals.user = null;

        if (!req.session.user) return next();

        try {

            let data = await model.User.findById(req.session.user, { hashPassword: 0 });

            if(data) {

                req.user = res.locals.user = data;

            }

            next();

        } catch (err) {

            next(err);

        }

    },

    isAdmin: (req, res, next) => {

        if(req.user) {

            if(req.user.isAdmin) {

                return next();

            }

        } else {

            throw new Error();

        }

    },

    isAutorize: (req, res, next) => {

        if(req.session.user) {

            return res.redirect('/user');

        }

        next();

    },

    checkAutorize: (req, res, next) => {

        if(!req.session.user) {

            return res.redirect('/signin');

        }

        next();

    },

};