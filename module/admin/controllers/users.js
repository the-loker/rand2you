
const models = require('../../../models');

module.exports = {

    getUser: async (req, res, next) => {

        try {

            req.userData = await models.User.findById(req.params.userId);

            next();

        } catch(err) {

            next(err);

        }

    },

    getUsers: async (req, res, next) => {

        try {

            req.users = await models.User.paginate({}, { sort: { signupDate: -1 } });

            next();

        } catch(err) {

            next(err);

        }

    },

    getUserHistory: async (req, res, next) => {

        try {

            req.userData = await models.History.paginate({userId: req.params.userId}, { sort: { signupDate: -1 } });

        } catch (err) {

            next(err);

        }

    },

    getUserPayments: async (req, res, next) => {

        try {



        } catch (err) {

            next(err);

        }

    },

    show: {

        user: (req, res) => {

            res.render('users/getUser', {

                title: `Пользователь ${req.userData.login}`,
                userData: req.userData

            });

        },

        users: (req, res) => {

            res.render('users/getUsers', {

                title: 'Users List Page',
                users: req.users

            });

        },

        history: (req, res) => {

            res.render('', {

                title: ``,

            })

        }

    }

};