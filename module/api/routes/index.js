const router = require('express').Router();

    require('./signin')(router);
    require('./static')(router);

module.exports = router;