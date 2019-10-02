const model       = require('../../../models');
const services    = require('../../../services');
const middleware  = require('../../../middleware');

function getGameTitleForStatus(status) {

    switch(status) {
        case 'active':
            return services.config.get('user.games.status.active');
            break;
        case 'completed':
            return services.config.get('user.games.status.completed');
            break;
        case 'pause':
            return services.config.get('user.games.status.pause');
            break;
        case 'parsing':
            return services.config.get('user.games.status.parsing');
            break;
        case 'verify':
            return services.config.get('user.games.status.verify');
            break;
        default:
            return services.config.get('user.games.title');
    }

}

module.exports = {

    findGame: async (req, res, next) => {

        if(req.errors) { return next(); }

        try {

            // Получить текущую игру и все ставки к ней
            let getGame = await model.Games.findOne({ _id: req.params.id})
                .populate({
                    path: 'rates',
                    options: {
                        sort: { date: -1 }
                    },
                    populate: {
                        path: 'userId',
                        select: 'login',
                    }
                });

            // Если не удается найти игру, то завершаем выполнение и отправляем ошибку 404
            if(!getGame) return next(middleware.error.create( 404, 'Game not found.' ));

            // Проверка игр со статусом 'active'
            if(getGame.status == 'active') {

                // Если у текущей игры ставок больше лимиту пользователей
                // то меняем статус у текущей игры для ручной проверки ставок
                if(getGame.rates.length > getGame.userLimit) {

                    await getGame.update({ $set: { status: 'verify' } });

                    return next();

                }

                // Если у текущей игры ставок равно лимиту пользователей
                // то меняем статус у текущей игры для последующей обработки
                if(getGame.rates.length == getGame.userLimit) {

                    await getGame.update({ $set: { status: 'parsing' } });

                    return next();

                }

            }

            req.game = getGame;

            next();

        } catch (err) {

            next(err);

        }

    },

    findGames: async (req, res, next) => {

        const gameStatus = req.params.status ? { status: req.params.status } : {};

        try {

            let data = await model.Games.find(gameStatus, null, { sort: { openDate: -1 } })
                .populate({
                    path: 'rates',
                    populate: {
                        path: 'userId',
                        select: 'login'
                    }
                });

            req.games = data;

            next();

        } catch (err) {

            next(err);

        }

    },

    show: {

        game: (req, res) => {

            res.render('game', {

                title: 'Игра для ' + req.game.userLimit + ' пользователей, стоимость ставки ' + req.game.rateSize + '₽',
                game: req.game,
                errors: req.errors

            });

        },

        games: (req, res) => {

            res.render('games', {

                title: getGameTitleForStatus(req.params.status),
                gamestatus: req.params.status,
                games: req.games < 1 ? null : req.games

            });

        }

    }

};