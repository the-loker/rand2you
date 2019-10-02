
const model = require('../../../models');
const services = require('../../../services');

module.exports = {

    find: async (req, res, next) => {

        try {

            const getUser = await model.User
                .paginate({ referer: req.user._id }, {
                    lean: true,
                    select: {
                        login: 1,
                        signupDate: 1
                    }
                });

            req.referrals = getUser.docs;

            next();

        } catch(err) {

            next(err);

        }

    },

    show: (req, res) => {

        res.render('partner', {

            title: services.config.get('user.partner.title'),
            referrals: req.referrals,
            userId: req.user._id,
            host: req.headers.host,

        })

    }

};