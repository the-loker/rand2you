const nconf   = require('nconf');
const path    = require('path');

const PATH = path.resolve(__dirname, '..', 'configs');

nconf.file('msg', {

    file: PATH + '/msg.json',
    logicalSeparator: '.'

});

nconf.file('meta', {

    file: PATH + '/meta.json',
    logicalSeparator: '.'

});

module.exports = nconf;