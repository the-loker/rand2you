const model        = require('../../../models');
const services     = require('../../../services');
const middleware   = require('../../../middleware');
const libs         = require('../../../libs');
const crypto       = require('crypto');
const _            = require('lodash');
const passGenerate = require('password-generator');

module.exports = {

    signin: async (req, res, next) => {

        if(req.errors) return next();

        const { email, password } = req.body;

        try {

            const user = await model.User.findOne({ email: email });

            if(user) {

                if(user.isBanned) {

                    req.errors = { signin: { msg: services.config.get('auth.user.banned') } };

                    return next();
                }

                let check = await user.checkPassword(password);

                if(check) {

                    user.signinDate = new Date;

                    user.save();

                    req.userId = user._id;
                    req.session.user = user._id;
                    req.session.date = libs.moment.now();
                    req.session.userInfo = {
                        browser: req.useragent.browser,
                        version: req.useragent.version,
                        os: req.useragent.os
                    };

                } else {

                    req.errors = { signin: { msg: services.config.get('auth.signin.fail') } };

                }

            } else {

                req.errors = { signin: { msg: services.config.get('auth.signin.fail') } };

            }

            next();

        } catch(err) {

            next(err);

        }

    },

    signup: async (req, res, next) => {

        if(req.errors) return next();

        const { login, email, password, referer } = req.body;

        try {

            const user = await model.User.create(req.body);

            // Передаем экземпляр пользователя далее для дальнейших операций с ним
            req.user = user;

            // Проверим есть ли рефер
            if(req.referer) {

                // Добавим реферу пользователя в список рефералов
                let referralsList = req.referer.referrals;

                referralsList.push(user._id);

                await req.referer.updateOne({ $set: { referrals: referralsList } });

            }

            // Отправим сообщение об успешной регистрации
            req.flash('successSignup', services.config.get('messages.successSignup'));

            next();

        } catch(err) {

            next(err);

        }

    },

    restore: async (req, res, next) => {

        if(req.errors) return next();

        try {

            const getUser = await model.User.findOne({ email: req.body.email }, { _id: 1, login: 1 });

            // Ищем сообщение с отправки которого не прошло 10 минут
            const checkMail = await model.Mail.findOne({ userId: { $eq: getUser._id }, date: { $gte: Date.now() - 600000 } });

            // Если сообщение найдено то просим юзера подождать
            if(checkMail) {

                req.flash('failRestoreMail', services.config.get('auth.restore.failRestoreMail'));

                return res.redirect('/restore');

            }

            const hash = crypto.createHmac('sha256', process.env.SALT_PASS + Date.now()).update(getUser._id.toString()).digest('hex');

            const sendMail =  await services.mailer.send({
                from: `${services.config.get('siteName')}: <${process.env.SUPPORT_EMAIL}>`,
                to: req.body.email,
                subject: `${services.config.get('siteName')} - Восстановление пароля пользователя ${getUser.login}`,
                template: 'restorePassword',
                data: {
                    login: getUser.login,
                    siteName: services.config.get('siteName'),
                    siteUrl: `${process.env.PROTOCOL}://${services.config.get('siteName').toLowerCase()}`,
                    linkRestore: `${process.env.PROTOCOL}://${services.config.get('siteName').toLowerCase()}/restore/${hash}`
                }
            });

            // Добавим в БД отправленное сообщение на email
            await model.Mail.create({
                userId: getUser._id,
                hash: hash,
                mailtype: 'restore'
            });

            let createHistory = new model.History({
                userId: getUser._id,
                action: 'restore',
                desc: 'Выполнен запрос для сброса пароля',
                fullDesc: 'Выполнен запрос для сброса пароля',
                info: {
                    browser: req.useragent.browser,
                    version: req.useragent.version,
                    os: req.useragent.os
                }
            });

            await createHistory.save();

            // Отправим сообщение пользователю что ему будет отправленно сообщение на email
            req.flash('successRestore', services.config.get('auth.restore.successRestoreMail'));

            res.redirect('/restore');

        } catch(err) {

            next(err);

        }

    },

    resetPassword: async (req, res, next) => {

        if(!req.params.hash) return next(middleware.error.create( 400, 'Bad Request' ));

        try {

            // Получаем сообщение, у которого не истек срок годности (не более 10 минут)
            const data = await model.Mail.findOne({
                hash: { $eq: req.params.hash },
                date: { $gte: Date.now() - 600000 }
            });

            if(!data) {

                // Если сообщение не найдено, то отправим ошибку
                return next(middleware.error.create( 400, 'Bad Request' ));

            } else {

                // Генерируем новый пароль
                const createNewPassword = passGenerate(_.random(8, 15), false);

                const getUser = await model.User.findById(data.userId);

                // отправим сообщение на email с новым паролем
                await services.mailer.send({
                    from: `${services.config.get('siteName')}: <${process.env.SUPPORT_EMAIL}>`,
                    to: getUser.email,
                    subject: `${services.config.get('siteName')} - Новый пароль пользователя ${getUser.login}`,
                    template: 'renewedPassword',
                    data: {
                        login: getUser.login,
                        siteName: services.config.get('siteName'),
                        renewedPassword: createNewPassword
                    }
                });

                // обновляем пароль
                await getUser.update({ hashPassword: model.User.getHashPassword(createNewPassword), updatePassword: Date.now() });


                // запишем в историю что пароль был обновлен
                let createHistory = new model.History({
                    userId: getUser._id,
                    action: 'restore',
                    desc: 'Обновление пароля',
                    fullDesc: 'Обновление пароля',
                    info: {
                        browser: req.useragent.browser,
                        version: req.useragent.version,
                        os: req.useragent.os
                    }
                });

                await createHistory.save();

                // удалим сообщение из БД
                await data.remove();

                req.flash('successResetPassword', services.config.get('auth.restore.successResetPasswordMail'));

            }

            res.redirect('/restore');

        } catch(err) {

            next(err);

        }

    },

    logout: async (req, res, next) => {

        try {

            await req.session.destroy();

            res.redirect('/signin');

        } catch (err) {

            next(err);

        }

    },

    getPartnerCookie: async (req, res, next) => {

        if(req.cookies.ref) {

            // Проверяем партнерскую куку
            req.checkCookies('ref', 'Incorrect partner cookie!').isObjectId();

            // Проверяем существуют ли ошибки валидации
            if(!req.validationErrors(true)) {

                try {

                    // Ищем пользователя с Id из партнерской куки
                    const checkUser = await model.User.findById(req.cookies.ref);

                    // Если пользователь существует то передаем по цепочке его Id
                    if(checkUser) {

                        req.body.referer = checkUser._id;

                        // Предаем экземпляр рефера далее по цепочке
                        // Если регистрация пройдет успешно, обновим у него список рефералов
                        req.referer = checkUser;

                    }

                } catch(err) {

                    next(err);

                }

            }

        }

        next();

    },

    saveHistory: async (req, res, next) => {

        if(req.errors) { return next(); }

        try {

            let data = new model.History({
                userId: req.userId,
                action: 'signin',
                desc: 'Вход в личный кабинет',
                fullDesc: 'Выполнен вход в личный кабинет',
                info: req.session.userInfo
            });

            await data.save();

            res.redirect('/user');

        } catch (err) {

            next(err);

        }

    },

    show: {

        signin: (req, res) => {

            if(req.errors) { res.status(400); }

            res.render('signin', {

                title: services.config.get('auth.signin.title'),
                captchaRender: res.recaptcha,
                errors: req.errors

            });

        },

        signup: (req, res) => {

            if(req.errors) { res.status(400); }

            res.render('signup', {

                title: services.config.get('auth.signup.title'),
                captchaRender: res.recaptcha,
                errors: req.errors

            });

        },

        restore: (req, res) => {

            if(req.errors) { res.status(400); }

            res.render('restore', {

                title: services.config.get('auth.restore.title'),
                captchaRender: res.recaptcha,
                errors: req.errors

            });

        }

    }

};