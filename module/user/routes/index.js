const router = require('express').Router();

    require('./payments')(router);
    require('./partner')(router);
    require('./settings')(router);
    require('./history')(router);
    require('./games')(router);
    require('./rates')(router);
    require('./user')(router);

module.exports = router;