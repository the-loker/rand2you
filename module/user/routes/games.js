
const controller = require('../controllers');

module.exports = (router) => {

    router.route('/game/:id')
        .get(
            //validator.isObjectId,
            controller.games.findGame,
            controller.games.show.game
        );

    router.route('/games/:status(active|completed|pause|parsing|verify)')
        .get(
            controller.games.findGames,
            controller.games.show.games
        );

    router.route('/games')
        .get(
            controller.games.findGames,
            controller.games.show.games
        );

};