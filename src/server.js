const net = require('net');
const colors = require('colors');
const config = require('./config');
const rooms = require('./rooms');
const util = require('util');
const socket = require('./socket');

var ot_server = config.OvertopServer();

// TCP Server Creation
var server = net.createServer(socket.newSocket);

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
            server.listen({host: 'localhost', port: 9000, exclusive: true}, ot_server.serverStarted);
        }, 1000);
    }else{
        console.log('ERROR: ' + e.code + ' is unhandled. Shutting down...'.red);
        server.close();
    }
});

// TCP Server Listen
server.listen({
    host: ot_server.hostName(), 
    port: ot_server.portNumber(), 
    exclusive: true}, 
    ot_server.serverStarted);