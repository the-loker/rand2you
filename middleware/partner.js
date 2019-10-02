
const model = require('../models');

module.exports = {

    setPartnerCookie: async (req, res, next) => {

        if(req.query.r) {

            // Проверяем партнерскую ссылку
            req.checkQuery('r', 'Incorrect partner link!').isObjectId();

            // Проверяем существуют ли ошибки валидации
            if(!req.validationErrors(true)) {

                if(!req.cookies.ref) {

                    // Установим партнерскую куку на 3 дня (1000 * 60 * 60 * 24 * 3)
                    res.cookie('ref', req.query.r, { maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true });

                } else {

                    // Удалим существующую куку
                    res.clearCookie('ref', { httpOnly: true });

                    // Установим новую партнерскую куку на 3 дня (1000 * 60 * 60 * 24 * 3)
                    res.cookie('ref', req.query.r, { maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true });

                }

            }

        }

        next();

    }

};