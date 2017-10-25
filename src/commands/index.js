const config = require('../config');

var eligibleActions = [
    "login",
    "join_room",
    "message",
    "logout"
];

module.exports = {
    parseDataIntoCommand: function(data) {
        var attemptedParse;
        try {
            attemptedParse = JSON.parse(data.toString('utf8'));
            return attemptedParse;
        }catch(e) {
            console.log(e);
            console.log(config.Error.cmd_unparseable);
            return false;
        }
    },
    cleanCommand: function(command) {
        if(!command.hasOwnProperty('action') || !command.hasOwnProperty('arg'))
            return false;

        JSON.stringify(command.action, function(k, v) { 
            if(typeof v != 'string') 
                return undefined; 
            return v; 
        });

        JSON.stringify(command.arg, function(k, v) { 
            if(typeof v != 'string') 
                return undefined; 
            return v; 
        });

        return {
            action: command.action.toLowerCase().trim(),
            arg: command.arg.toLowerCase().trim()
        };
    },
    processCommand: function(command) {
        if(eligibleActions.indexOf(command.action) == -1)
            throw(config.Error.cmd_action_invalid);
        switch(command.action)
        {
            case "login": {
                console.log("Logging in...");
                break;
            }
            case "message": {
                console.log("Sending a message...");
                break;
            }
            case "join_room": {
                console.log("Joining room...");
                break;
            }
            case "logout": {
                console.log("Logging out...");
                break;
            }
            default: {
                throw(config.Error.cmd_action_unhandled);
                break;
            }
        }
    }
};