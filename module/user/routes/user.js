
const controller = require('../controllers');

module.exports = (router) => {

    router.route('/:id')
        .get(
            controller.user.getUser,
            controller.user.show.user
        );

    router.route('/')
        .get(controller.user.show.home);

};
