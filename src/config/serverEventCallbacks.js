var ot_server = require('./index.js');
const socket = require('../socket');
const colors = require('colors');

module.exports = [
    {
        name: "connection",
        fn: socket.newSocket
    },
    {
        name: "listening",
        fn: function() {
            if(!ot_server.isQuiet())
                console.log("Overtop Server is listening...".green);
        }
    },
    {
        name: "close",
        fn: function() {
            if(!ot_server.isQuiet())
                console.log("Overtop Server Shut Down.".green);
        }
    }
];