const commands = require('../commands');
const config = require('../config');

// Array of all sockets
var sockets = [];

function cleanInput(data) {
    return data.toString().replace(/(\r\n|\n|\r)/gm, "");
};

function receiveData(socket, d) {
    var cleanData = cleanInput(d);
    if(cleanData === '@quit') {
        socket.destroy();
    } else {
        try {
            var cmd = commands.parseDataIntoCommand(d);
            cmd = commands.cleanCommand(cmd);
            commands.processCommand(cmd);
            socket.write(config.Response.successCmd);
        }catch(e) {
            var res = config.Response.failCmd;
            res.msg = e;
            var str = JSON.stringify(res);
            socket.write(str);
            if(!config.isQuiet()) {
                console.log(e);
            }
        }
        // for(var i = 0; i < sockets.length; i++) {
        //     if(sockets[i] != socket) sockets[i].write(socket.name + '> '+ d + '\r\n');
        // }
        //
    }
};

function closeSocket(socket) {
    var i = sockets.indexOf(socket);
    if(i != -1) {
        sockets.splice(i, 1);
        if(!config.isQuiet()) {
            sockets.every((sock) => { sock.write(socket.name+ '> has left the chat server.\r\n'); });
            process.stdout.write(socket.name + '> has left the chat server.\r\n');
        }
    }
};

module.exports = {
    newSocket: function(socket) {
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        sockets.push(socket);
        socket.on('data', (data) => { receiveData(socket, data); });
        socket.on('error', () => { socket.destroy(); });
        socket.once('close', () => { closeSocket(socket); });
        socket.write(config.Response.welcome);
        for(var i = 0; i < sockets.length; i++) {
            if(sockets[i] != socket) {
                sockets[i].write(socket.name + '> has joined the chat server.\r\n');
            }
        }
        if(!config.isQuiet()) {
            process.stdout.write(socket.name + '> has joined the chat server.\r\n'); // Server Log
        }
    },
    numSockets: function() {
        return sockets.length;
    }
};