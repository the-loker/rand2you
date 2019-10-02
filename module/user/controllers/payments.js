
const services = require('../../../services');

module.exports = {

    show: (req, res) => {

        res.render('payments', {

            title: services.config.get('user.payments.title')

        });

    }

};