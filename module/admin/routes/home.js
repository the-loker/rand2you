
const services = require('../../../services');

module.exports = router => {

    router.get('/', (req, res) => {

        res.render('home', {

            title: services.config.get('admin.home.title')

        });

    });

};