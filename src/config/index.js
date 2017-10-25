const fs = require('fs');

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
            }
        };
    }
};