
const model     = require('../../../models');
const services  = require('../../../services');
const libs      = require('../../../libs');

module.exports = {

    find: async (req, res, next) => {

        try {

            let options = {

                page: !req.params.page ? 1 : req.params.page,
                sort: { date: -1 },
                lean: true,

            };

            req.history = await model.History.paginate({userId: req.user._id}, options);

            next()

        } catch(err) {

            next(err);

        }

    },

    show: {

        index: (req, res) => {

            res.render('history', {
                title: services.config.get('user.history.title'),
                history: req.history,
                pagination: libs.pagination('/user/history/page/', req.history.page, req.history.pages)
            });

        }

    }

};