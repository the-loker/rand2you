
const model = require('../../../models');

module.exports = {

    create: async (req, res, next) => {

        if(req.errors) { return next(); }

        try {

            // Добавляем новую ставку в базу данных
            let rate = await model.Rates.create({
                userId: req.user._id,
                gameId: req.game._id,
                rateSize: req.game.rateSize
            });

            // Снимаем сумму ставки из баланса пользователя
            req.user.balance = req.user.getBalance() - req.game.rateSize;

            // Добавляем ставку в коллекцию с игрой
            req.game.rates.push([ rate._id ]);

            await req.game.updateOne({ $set: { rates: req.game.rates } });

            // Обновим баланс пользователя
            await req.user.updateOne({ $set: { balance: req.user.balance } });

            // Отправим сообщение клиентам о новой ставке
            req.app.get('socket').sockets.emit('new rate', {
                newRate: {
                    userId: req.user._id,
                    userLogin: req.user.login,
                    gameId: req.game._id,
                    rateSize: req.game.rateSize,
                    rateDate: Date.now(),
                }
            });

            next();

        } catch (e) {

            next(e);

        }

    },

    // Записать в историю инфу о ставке
    rateSaveHistory: async (req, res, next) => {

        if(req.errors) { return next(); }

        try {

            let data = await model.History.create({
                userId: req.user._id,
                action: 'rate',
                desc: `Ставка в размере ${ req.game.rateSize } ₽`,
                fullDesc: `Вы выполнили ставку в размере ${ req.game.rateSize } рублей <a href='/user/game/${ req.game._id }'>(Ссылка на игру)</a>`
            });

            res.redirect('/user/game/' + req.game._id);

        } catch(err) {

            next(err);

        }

    },

    rateValidate: async (req, res, next) => {

        // TODO Сделать проверку активации профиля пользователя

        // Проверяем если статус игры не "active" то ставки не возможны
        if(req.game.status != 'active') {

            req.errors = req.errors = Object.assign({

                statusIsNotActive: {
                    msg: 'Ставка не возможна!'
                }

            }, req.errors);

            return next();

        }

        // Если ставок больше или равно чем лимит пользователей в игре
        // то прерываем работу, создаем ошибку и вызываем next()
        if(req.game.rates.length >= req.game.userLimit) {

            req.errors = Object.assign({

                maxRateInGame: {
                    msg: 'В данной игре нет мест для ставок!'
                }

            }, req.errors);

            return next();

        }

        // Проверяем баланс пользователя, хватает ли у него баланса для ставки
        if(req.user.getBalance() < req.game.rateSize) {

            req.errors = Object.assign({

                userNotBalance: {
                    msg: 'На вашем балансе не достаточно средств!'
                }

            }, req.errors);

            return next();

        }

        try {

            let data = await model.Rates.findOne({
                userId: req.user._id,
                gameId: req.params.id
            });

            // Проверим есть ли ставки у пользователя в данной игре
            if(data) {

                req.errors = Object.assign({

                    rateRequired: {
                        msg: 'В этой игре участвовать можно один раз!'
                    }

                }, req.errors);

            }

            next();

        } catch (err) {

            return next(err);

        }

    }

};