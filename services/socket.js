module.exports = (server) => {

    const socket = require('socket.io')(server);

    socket.on('connection', function (socket) {

    });

    return socket;

};