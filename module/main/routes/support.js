const controller   = require('../controllers');
const services     = require('../../../services');
const middleware   = require('../../../middleware');

module.exports = router => {

    router.route('/support')
        .get(
            services.recaptcha.middleware.render,
            controller.support.show
        )
        .post(
            services.recaptcha.middleware.render,
            services.recaptcha.middleware.verify,
            middleware.validator.support,
            controller.support.checkCaptcha,
            middleware.validator.asyncGetErrors,
            controller.support.create,
            controller.support.show
        );

};