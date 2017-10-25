const fs = require('fs');
const colors = require('colors');

module.exports = {
    OvertopServer: function() {
        // private data members
        var dataFields = {
            errorsHit: 0,
            maxErrorsAllowed: 4,
            hostName: "127.0.0.1",
            port: 9000
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
                return dataFields.hostName;
            },
            portNumber: function() {
                return dataFields.port;
            },
            serverStarted: function() {
                console.log("Overtop TCP Server started!\r\n".green);
            }
        };
    },
    Error: {
        cmd_unparseable: "Command could not be parsed from the client.",
        cmd_action_invalid: "Command action was invalid.",
        cmd_arg_invalid: "Command argument was invalid.",
        cmd_action_unhandled: "Command action is not handled."
    }
};