const Recaptcha = require('express-recaptcha').Recaptcha;

const recaptcha = new Recaptcha(process.env.CAPTCHA_PUBLIC_KEY, process.env.CAPTCHA_PRIVATE_KEY);

module.exports = recaptcha;