module.exports = {

    create: require('http-errors'),

    notFound(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    },

    development(err, req, res, next) {

        console.log(err);

        res.status(err.status || 500).render('error', {

            message: err.message,
            status: err.status || 500,
            error: err

        });

    },

    production(err, req, res, next) {

        res.status(err.status || 500).render('error', {

            message: 'Упс! Что-то пошло не так!',
            status: err.status || 500

        });
    }

};