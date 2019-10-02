
const controller = require('../controllers');

module.exports = (router) => {

    router.route('/partner')
        .get(
            controller.partner.find,
            controller.partner.show
        );

};