
const controller = require('../controllers');

module.exports = (router) => {

    router.route('/payments')
        .get(
            controller.payments.show
        );

};