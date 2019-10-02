
const controller = require('../controllers');

module.exports = (router) => {

    router.route('/game/:id')
        .get(
            //validator.isObjectId,
            controller.games.find.game,
            controller.games.show.game
        );

    router.route('/games/:status(active|completed|pause|parsing|verify)')
        .get(
            controller.games.find.games,
            controller.games.show.games
        );

    router.route('/games')
        .get(
            controller.games.find.games,
            controller.games.show.games
        );

    /* Create Lottery */
    router.route('/games/create')
        .get(controller.games.show.create)
        .post(
            controller.games.create,
            controller.games.show.create
        );

};