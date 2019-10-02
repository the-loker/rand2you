const _       = require('lodash');
const cron    = require('node-cron');
const models  = require('../models');


const faker = require('faker');


module.exports = socket => {

    cron.schedule("59 * * * * *", async function () {

        try {

            const getGames = await models.Games.find({ status: 'parsing' })
                .populate({
                    path: 'rates',
                    populate: {
                        path: 'userId',
                        select: { referer: 1, login: 1 },
                    }
                });

            if(getGames.length > 0) {

                for(const game of getGames) {

                    // Перемешиваем все ставки
                    const mixRates = _.shuffle(game.rates);

                    // Определяем победителей
                    const getWinners = _.sampleSize(mixRates, game.userWinners);

                    const winners = [];

                    for(const user of getWinners) {
                        winners.push(user.userId._id);
                    }

                    for(const winner of winners) {

                        // Считаем общий выигрыш с учетом комиссии
                        let bank = (game.userLimit * game.rateSize) - (game.userLimit * game.rateSize) * process.env.SERVICE_COMMISSION / 100;
                        // Считаем профит для каждого победителя
                        let profit = bank / game.userWinners;

                        let user = await models.User.findById(winner);

                        await user.updateOne({ balance: user.balance + profit });

                        await models.History.create({
                            userId: winner,
                            action: 'payment',
                            desc: `Победа в игре <a href='/user/game/${ game._id }'>(Ссылка на игру)</a>. Зачислено ${ profit }₽`,
                            fullDesc: `Победа в игре ${ game._id }. Зачислено ${ profit }₽`,
                        });

                    }

                    // Добавим выбраных победителей в список и обновим статус игры на "completed"
                    await models.Games.updateOne({ _id: game._id }, { winners: winners, status: 'completed' });

                    // Начислим реферальный процент реферам пользователей
                    for(const user of game.rates) {

                        if(user.userId.referer) {

                            // Считаем реферальный процент от стоимости ставки
                            const refererCommission = game.rateSize * process.env.REFERER_COMMISSION / 100;

                            const getUser = await models.User.findById(user.userId.referer);

                            getUser.updateOne({ balance: getUser.balance + refererCommission });

                            // Добавим реферу приход платежа рефбека
                            await models.Payments.create({
                                userId: getUser._id,
                                amount: refererCommission,
                                action: 'refback',
                            });

                            // Добавим реферу в историю начисление рефбека
                            await models.History.create({
                                userId: getUser._id,
                                action: 'payment',
                                desc: `Рефбек в размере ${ refererCommission }₽ от пользователя ${ user.userId.login }`,
                                fullDesc: `Рефбек в размере ${ refererCommission }₽ от пользователя ${ user.userId.login }`,
                            });

                        }

                    }

                    // Если есть автоповтор игры то создаем подобную
                    if(game.repeat) {

                        const createGame = await models.Games.create({
                            userLimit: game.userLimit,
                            rateSize: game.rateSize,
                            userWinners: game.userWinners,
                            repeat: true
                        });

                        socket.sockets.emit('openGame', createGame);

                    }

                }

                console.log('Get '+ getGames.length + ' games!');

                // 1 Получаем все игры со статусом "parsing" + все ставки + реферов пользователей которые сделали ставки
                // 2 Проходим циклом по всем играм
                // 3 Премешиваем все ставки
                // 4 Определяем победителей
                // 5 Начисляем выигрыш победителям + запишем в их историю сведения о выиграше
                // 6 Начислим реферальный процент реферам пользователей + запишем в их историю сведения о начислении реферального процента
                // 7 Обновим статус игры на "completed" + запишем победителей в текущую игру

            }

        } catch (err) {

            console.log('Task error: '+ err);

        }

    });

    function rand () {

        var users = [];

        for (i = 0; i < 30; i++) {

            users.push(i + 'user' + i);

        }

        for (i = 0; i < 5; i++) {

            users = _.shuffle(users);

        }


        for (i = 0; i < 30; i++) {

            var winns = _.sampleSize(users, 3);

            for (a = 0; a < 2; a++) {


                if (winns[0] == winns[a + 1]) {

                    console.log(winns);

                    console.log('error ' + winns[a])

                    console.log('====================================================================================');

                }

            }

        }

        console.log(winns);
    };

    //setInterval(rand, 2000);



};
