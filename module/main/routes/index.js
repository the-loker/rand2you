const router = require('express').Router();

    require('./auth')(router);

    require('./static')(router);

    require('./support')(router);

module.exports = router;