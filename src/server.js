const net = require('net');

// Array of sockets (clients)
var sockets = [];

// New Socket callback
function newSocket(socket) {
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    socket.buff = "";
    sockets.push(socket);
    socket.write('Welcome to the Telnet Server ' + socket.name + '!\r\n');
    socket.on('data', (data) => { recvData(socket, data); });
    //socket.on('end', () => { closeSocket(socket); });
    socket.once('close', () => { closeSocket(socket); });
    process.stdout.write(socket.name + ' has joined the chat server.\r\n');
};

// Callback method execute when data is received from a socket
function recvData(socket, d) {
    var cleanData = cleanInput(d);
    if(cleanData === '@quit') {
        socket.end('Goodbye!\r\n');
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
        sockets.every((sock) => { sock.write(socket.name+ ' has left the chat server.\r\n'); });
        process.stdout.write(socket.name + ' has left the chat server.\r\n');
    }
};

function cleanInput(data) {
    return data.toString().replace(/(\r\n|\n|\r)/gm, "");
};

// TCP Server Creation
var server = net.createServer(newSocket);

// TCP Server Listen
server.listen({host: 'localhost', port: 9000, exclusive: true});