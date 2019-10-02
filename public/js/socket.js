var socket = io('http://localhost:3000');

socket.on('new rate', function (data) {
    console.log(data);
});
socket.on('openGame', function (data) {
    console.log(data);
});