const fs = require('fs');
const colors = require('colors');
const net = require('net');

var server,
    hostName = "127.0.0.1",
    port = 9000,
    quiet = false;

module.exports = {
    setQuietMode: function(bool) {
        quiet = bool;
    },
    isQuiet: function() {
        return quiet;
    },
    OvertopServer: function() {
        // private data members
        var dataFields = {
            errorsHit: 0,
            maxErrorsAllowed: 4
        };

        // public interface
        return {
            addError: function() {
                if(dataFields.errorsHit + 1 > dataFields.maxErrorsAllowed) {
                    dataFields.errorsHit = dataFields.maxErrorsAllowed;
                    return dataFields.errorsHit;
                }
                return ++dataFields.errorsHit;
            },
            rmError: function() {
                if(dataFields.errorsHit - 1 < 0) {
                    dataFields.errorsHit = 0;
                    return 0;
                }
                return --dataFields.errorsHit;
            },
            hostName: function() {
                return hostName;
            },
            portNumber: function() {
                return port;
            },
            init: function() {
                server = net.createServer();
                if(!quiet)
                    console.log("Overtop TCP Server Created!".green);
            },
            config: function(eventCallbacks) {
                eventCallbacks.forEach(function(eventCallback) {
                    server.on(eventCallback.name, eventCallback.fn);
                });
            },
            start: function() {
                server.listen({host: hostName, port: port, exclusive: true});
            },
            close: function() {
                server.close();
            }
        };
    },
    Error: {
        /** 
         * Error in JSON.parse() and/or data.toString('utf8') within commands.parseDataIntoCommand()
         */
        cmd_unparseable: "Command could not be parsed from the client.",
        /** 
         * Error when validating the presence of JSON keys 'action' and 'arg' within commands.cleanCommand()
         */
        cmd_misunderstood: "Command could not be understood.",
        /** 
         * Error when validating 'action' within commands.processCommand()
         */
        cmd_action_invalid: "Command action was invalid.",
        /** 
         * Error when validating 'arg' within commands.cleanCommand()
         */
        cmd_arg_invalid: "Command argument was invalid.",
        /** 
         * Error when 'action' is fair but no known function will handle it
         */
        cmd_action_unhandled: "Command action is not handled."
    },
    Response: {
        welcome: "{\"code\": \"0\", \"msg\": \"Welcome\"}",
        bye: "{\"code\": \"0\", \"msg\": \"Bye\"}",
        successCmd: "{\"code\": \"0\", \"msg\": \"Accepted\"}",
        failCmd: {code: -1, msg: ""}
    }
};