
const controller = require('../controllers');

module.exports = (router) => {

    router.route('/settings/security/session/remove')
        .post(
            controller.settings.session.remove,
            controller.settings.session.get,
            controller.settings.show
        );

    router.route('/settings')
        .get(
            controller.settings.session.get,
            controller.settings.show
        );

};