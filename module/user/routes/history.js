
const controller = require('../controllers');

module.exports = (router) => {

    router.route('/history')
        .get(
            controller.history.find,
            controller.history.show.index
        );

    router.route('/history/page/:page')
        .get(
            controller.history.find,
            controller.history.show.index
        );

};