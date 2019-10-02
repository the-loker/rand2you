const app      = require('./app');
const http     = require('http');
const server   = http.createServer(app);
const socket   = require('./services').socket(server);
const tasks    = require('./tasks').games(socket);
const debug    = require('debug')('rand2you:server');
const port     = app.get('port');

app.set('socket', socket);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
