const config = require('../config');

var eligibleActions = [
    "login",
    "join_room",
    "message",
    "logout",
    "unhandled"
];

module.exports = {
    parseDataIntoCommand: function(data) {
        var attemptedParse;
        try {
            attemptedParse = JSON.parse(data.toString('utf8'));
            return attemptedParse;
        }catch(e) {
            if(!config.isQuiet()) {
                console.log(e);
                console.log(config.Error.cmd_unparseable);
            }
            throw config.Error.cmd_unparseable;
        }
    },
    cleanCommand: function(command) {
        var cmd = {};

        if(!command.hasOwnProperty('action') || !command.hasOwnProperty('arg'))
            throw config.Error.cmd_misunderstood;

        try {
            JSON.stringify(command.action, function(k, v) { 
                if(typeof v === 'string') 
                    return v; 
                return undefined; 
            });

            JSON.stringify(command.arg, function(k, v) { 
                if(typeof v === 'string') 
                    return v; 
                return undefined; 
            });

            cmd.action = command.action.toLowerCase().trim();
            cmd.arg = command.arg;
        }catch(e) {
            throw config.Error.cmd_unparseable;
        }
        
        return cmd;
    },
    processCommand: function(command) {
        if(eligibleActions.indexOf(command.action) == -1)
            throw config.Error.cmd_action_invalid;
        switch(command.action)
        {
            case "login": {
                //console.log("Logging in...");
                break;
            }
            case "message": {
                //console.log("Sending a message...");
                break;
            }
            case "join_room": {
                //console.log("Joining room...");
                break;
            }
            case "logout": {
                //console.log("Logging out...");
                break;
            }
            default: {
                throw config.Error.cmd_action_unhandled;
                break;
            }
        }
    }
};