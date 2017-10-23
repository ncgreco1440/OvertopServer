const net = require('net');
const colors = require('colors');

// Array of sockets (clients)
var sockets = [];

// New Socket callback
function newSocket(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    sockets.push(socket);
    socket.on('data', (data) => { recvData(socket, data); });
    socket.on('error', () => { socket.destroy(); });
    socket.once('close', () => { closeSocket(socket); });
    for(var i = 0; i < sockets.length; i++) {
        if(sockets[i] != socket) sockets[i].write(socket.name + '> has joined the chat server.\r\n');
    }
    process.stdout.write(socket.name + '> has joined the chat server.\r\n');
};

// Callback method execute when data is received from a socket
function recvData(socket, d) {
    var cleanData = cleanInput(d);
    if(cleanData === '@quit') {
        socket.destroy();
    } else {
        for(var i = 0; i < sockets.length; i++) {
            if(sockets[i] != socket) sockets[i].write(socket.name + '> '+ d + '\r\n');
        }
        process.stdout.write(socket.name + '> '+ d + '\r\n');
    }
}; 

// Callback method execute when a socket ends
function closeSocket(socket) {
    var i = sockets.indexOf(socket);
    if(i != -1) {
        sockets.splice(i, 1);
        sockets.every((sock) => { sock.write(socket.name+ '> has left the chat server.\r\n'); });
        process.stdout.write(socket.name + '> has left the chat server.\r\n');
    }
};

function cleanInput(data) {
    return data.toString().replace(/(\r\n|\n|\r)/gm, "");
};

function serverStarted() {
    process.stdout.write("Overtop TCP Server started!\r\n".green);
};

// TCP Server Creation
var server = net.createServer(newSocket);

// TCP Server Listen
server.listen({host: 'localhost', port: 9000, exclusive: true}, serverStarted);