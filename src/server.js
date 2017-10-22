const net = require('net');

const server = net.createServer((socket) => {
   socket.end('goodbye\n'); 
}).on('error', (err) => {
    throw err;
});

server.listen({host: 'localhost', port: 80, exclusive: true}, () => {
    console.log('opened server on ', server.address());
});