const router = require('express').Router();

    require('./users')(router);
    require('./games')(router);
    require('./home')(router);

module.exports = router;