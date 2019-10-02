
const model = require('../../../models');
const services = require('../../../services');

module.exports = {

    session: {

        get: async (req, res, next) => {

            try {

                req.getSessions = await model.Sessions
                    .find({'session.user': req.user._id })
                    .lean()
                    .sort({expires: -1});

                next();

            } catch(err) {

                next(err);

            }

        },

        remove: async (req, res, next) => {

            try {

                await model.Sessions.deleteMany({'session.user': req.user._id, _id: { $ne: req.sessionID }});

                res.redirect('/user/settings');

            } catch (err) {

                next(err);

            }

        }

    },

    show: (req, res) => {

        res.render('settings', {

            title: services.config.get('user.settings.title'),
            sessions: req.getSessions,
            currentSessionID: req.sessionID,
            updatePassword: req.user.updatePassword

        })

    }

};