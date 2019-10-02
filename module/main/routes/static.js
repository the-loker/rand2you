const controller   = require('../controllers');
const services     = require('../../../services');

module.exports = router => {

    router.get('/rules', (req, res) => {

        res.render('rules', {

            title: services.config.get('rules.title')

        });

    });

    router.route('/')
        .get(
            controller.main.getCountUsers,
            controller.main.getCountRates,
            controller.main.getCountRatesFor24Hours,
            (req, res) => {

                res.render('home', {

                    title: services.config.get('home.title'),
                    countUsers: req.countUsers, // Общее количество пользователей
                    countRates: req.countRates, // Общее количество ставок
                    ratesFor24Hours: req.ratesFor24Hours, // Количество ставок за 24 часа

                });

            }
        );

};