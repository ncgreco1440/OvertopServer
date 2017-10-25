const colors = require('colors');
const config = require('./config');
const eventCallbacks = require('./config/serverEventCallbacks.js');

var ot_server = config.OvertopServer();
ot_server.init();
ot_server.config(eventCallbacks);
ot_server.start();