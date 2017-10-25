const net = require('net');
const colors = require('colors');
const config = require('./config');
const rooms = require('./rooms');
const util = require('util');

var ot_server = config.OvertopServer();

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
        try {
            processCommand(JSON.parse(d.toString('utf8')));
        }catch(e) {
            console.log("The command was unrecognizable.");
        }
        
        // for(var i = 0; i < sockets.length; i++) {
        //     if(sockets[i] != socket) sockets[i].write(socket.name + '> '+ d + '\r\n');
        // }
        //
        //var data = JSON.parse(util.format("%j", d));
        //process.stdout.write(socket.name + '> '+ d + '\r\n');
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
    ot_server.rmError();
    process.stdout.write("Overtop TCP Server started!\r\n".green);
};

function processCommand(command) {
    if(!command.hasOwnProperty('action') || !command.hasOwnProperty('arg'))
        return; // Data is lacking necessary params, stop.
    switch(command.action) {
        case "login": {
            console.log("logging client in");
            break;
        }
        case "join_room": {
            console.log("client wants to join a room");
            break;
        }
        case "message": {
            console.log("client had a message")
            break;
        }
        case "logout": {
            console.log("client logged out");
            break;
        }
    }
}

// TCP Server Creation
var server = net.createServer(newSocket);

// Handle errors
server.on('error', (e) => {
    if(ot_server.addError() === 3) {
        console.log("Maximum error call stack reached. Terminating server...".yellow);
        server.close();
        return;
    }

    if(e.code === 'EADDRINUSE') {
        console.log('Address is in use, retrying...'.red);
        setTimeout(() => {
            server.close();
            server.listen({host: 'localhost', port: 9000, exclusive: true}, serverStarted);
        }, 1000);
    }else{
        console.log('ERROR: ' + e.code + ' is unhandled. Shutting down...'.red);
        server.close();
    }
});

// TCP Server Listen
server.listen({host: 'localhost', port: 9000, exclusive: true}, serverStarted);