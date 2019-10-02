
const controller = require('../controllers');

module.exports = (router) => {

    router.route('/game/rate/:id')
        .post(
            //validatorMiddleware.isObjectId,
            controller.games.findGame,
            controller.rates.rateValidate,
            controller.rates.create,
            controller.rates.rateSaveHistory,
            controller.games.show.game
        );

};