const model        = require('../../../models');
const services     = require('../../../services');

module.exports = {

    getCountUsers: async (req, res, next) => {

        try {

            let getCache = await services.cache.getAsync('countUsers');

            if(!getCache) {

                req.countUsers = await model.User.countDocuments();

                await services.cache.setAsync('countUsers', req.countRates, 60 * 2);

            } else {

                req.countUsers = getCache;

            }

            next();

        } catch (err) {

            next(err);

        }

    },

    getCountRates: async (req, res, next) => {

        try {

            let getCache = await services.cache.getAsync('countRates');

            if(!getCache) {

                req.countRates = await model.Rates.countDocuments();

                await services.cache.setAsync('countRates', req.countRates, 60 * 2);

            } else {

                req.countRates = getCache;

            }

            next();

        } catch (err) {

            next(err);

        }

    },

    getCountRatesFor24Hours: async (req, res, next) => {

        try {

            let getCache = await services.cache.getAsync('ratesFor24Hours');

            if(!getCache) {

                req.ratesFor24Hours = await model.Rates.countDocuments({ date: { $gte: Date.now() - (1000 * 60 * 60 * 24) } });

                await services.cache.setAsync('ratesFor24Hours', req.ratesFor24Hours, 60 * 2);

            } else {

                req.ratesFor24Hours = getCache;

            }

            next();

        } catch (err) {

            next(err);

        }

    }

};