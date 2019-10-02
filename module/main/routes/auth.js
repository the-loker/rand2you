const controller   = require('../controllers');
const middleware   = require('../../../middleware');
const services     = require('../../../services');

module.exports = router => {

    router.route('/signin')
        .get(
            services.recaptcha.middleware.render, // Рендер каптчи
            controller.auth.show.signin // Вид страници авторизации
        )
        .post(
            services.recaptcha.middleware.render, // Рендер каптчи
            middleware.validator.signin, // Валидация полей формы
            services.recaptcha.middleware.verify, // Валидация каптчи
            middleware.validator.checkCaptcha, // Проперка каптчи на ошибки
            middleware.validator.asyncGetErrors, // Сбор всех ошибок
            controller.auth.signin, // Авторизация
            controller.auth.saveHistory,
            controller.auth.show.signin // Вид страници авторизации
        );

    router.route('/signup')
        .get(
            services.recaptcha.middleware.render, // Рендер каптчи
            controller.auth.show.signup
        )
        .post(
            services.recaptcha.middleware.render, // Рендер каптчи
            middleware.validator.signup, // Валидация полей формы
            services.recaptcha.middleware.verify, // Валидация каптчи
            middleware.validator.checkCaptcha, // Проперка каптчи на ошибки
            middleware.validator.asyncGetErrors, // Сбор всех ошибок
            controller.auth.getPartnerCookie, // Проверим партнерскую куку, если она есть
            controller.auth.signup, // Регистрация пользователя
            controller.auth.show.signup // Вид страници регистрации
        );

    router.route('/restore')
        .get(
            services.recaptcha.middleware.render, // Рендер каптчи
            controller.auth.show.restore // Страница востановления пароля
        )
        .post(
            services.recaptcha.middleware.render, // Рендер каптчи
            //services.recaptcha.middleware.verify, // Валидация каптчи
            middleware.validator.restore, // Валидация формы
            //middleware.validator.checkCaptcha, // Проперка каптчи на ошибки
            middleware.validator.asyncGetErrors, // Сбор всех ошибок
            controller.auth.restore, // Отправка письма для сброса пароля
            controller.auth.show.restore // Страница востановления пароля
        );

    // Сброс пароля
    router.route('/restore/:hash')
        .get(
            controller.auth.resetPassword
        );

    router.get('/logout', controller.auth.logout);

};