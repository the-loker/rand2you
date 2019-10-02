
const controller = require('../controllers');

module.exports = router => {

    router.route('/user/:userId')
        .get(
            controller.users.getUser,
            controller.users.show.user
        )
        .post();

    router.route('/users')
        .get(
            controller.users.getUsers,
            controller.users.show.users
        );

    router.route('/user/partner/:userId')
        .get();
    router.route('/user/payments/:userId')
        .get();
    router.route('/user/history/:userId')
        .get();

};