var config = require('../src/config');
const eventCallbacks = require('../src/config/serverEventCallbacks.js');
const assert = require('assert');
const net = require('net');
const socket = require('../src/socket');

describe.only('TCP Socket', function() {
    config.setQuietMode(true);

    that = {
        server: null,
        client: null,
        autoConnect: function() {
            that.client.connect(9000, "127.0.0.1");
        },
        jsonToString: function(json) {
            var str = JSON.stringify(json);
            return str;
        }
    };

    beforeEach(function() {
        that.server = config.OvertopServer();
        that.server.init();
        that.server.config(eventCallbacks);
        that.server.start();
        that.client = new net.Socket();
    });

    afterEach(function() {
        that.client.destroy();
        that.server.close();
    });

    describe('when connecting to the server', function() {
        it('should respond with a success message', function(done) {
            that.client.on('data', function(d) {
                assert.equal(config.Response.welcome, d);
                done();
            });
            that.client.connect(9000, "127.0.0.1");
        });

        it('should add a new socket to the socket array', function(done) {
            assert.equal(socket.numSockets(), 0);
            that.client.connect(9000, "127.0.0.1");
            setTimeout(function() {
                assert.equal(socket.numSockets(), 1);
                done();
            }, 500);
        });
    });

    describe('when sending valid commands to the server', function() {
        beforeEach(function() {
            that.autoConnect();
        });

        it('should respond with an \"accepted command\" message if the \"login\" command was correct', function(done) {
            that.client.on('data', function(d) {
                if(d.toString('utf8') === config.Response.successCmd) {
                    assert.equal(true, true); //Assert true because we got here.
                    done();
                }
            });
            setTimeout(function() {
                that.client.write(that.jsonToString({"action": "login", "arg": "args"}));
            }, 500);
        });

        it('should respond with an \"accepted command\" message if the \"join_room\" command was correct', function(done) {
            that.client.on('data', function(d) {
                if(d.toString('utf8') === config.Response.successCmd) {
                    assert.equal(true, true); //Assert true because we got here.
                    done();
                }
            });
            setTimeout(function() {
                that.client.write(that.jsonToString({"action": "join_room", "arg": "args"}));
            }, 500);
        });

        it('should respond with an \"accepted command\" message if the \"message\" command was correct', function(done) {
            that.client.on('data', function(d) {
                if(d.toString('utf8') === config.Response.successCmd) {
                    assert.equal(true, true); //Assert true because we got here.
                    done();
                }
            });
            setTimeout(function() {
                that.client.write(that.jsonToString({"action": "message", "arg": "This is a message..."}));
            }, 500);
        });

        it('should respond with an \"accepted command\" message if the \"logout\" command was correct', function(done) {
            that.client.on('data', function(d) {
                if(d.toString('utf8') === config.Response.successCmd) {
                    assert.equal(true, true); //Assert true because we got here.
                    done();
                }
            });
            setTimeout(function() {
                that.client.write(that.jsonToString({"action": "logout", "arg": "args"}));
            }, 500);
        });
    });

    describe('when sending invalid commands to the server', function() {
        InvalidCommandHelper = {
            generateErrorMsgStr: function(msg) {
                var errorObj = config.Response.failCmd;
                errorObj.msg = msg;
                return JSON.stringify(errorObj);
            }
        };

        beforeEach(function() {
            that.autoConnect();
        });

        it('should respond with an \"unparseable command message\" if the command cannot be parsed into JSON', function(done) {
            var str = InvalidCommandHelper.generateErrorMsgStr(config.Error.cmd_unparseable);

            that.client.on('data', function(d) {
                if(d.toString('utf8') === str) {
                    assert.equal(true, true); // Assert true because we got here.
                    done();
                }
            });
            setTimeout(function() {
                that.client.write("unparseable json");
            }, 500);
        });

        it('should respond with an \"misunderstood command message\" if the command\'s \'action\' key could not be understood', function(done) {
            var str = InvalidCommandHelper.generateErrorMsgStr(config.Error.cmd_misunderstood);

            that.client.on('data', function(d) {
                if(d.toString('utf8') === str) {
                    assert.equal(true, true); // Assert true because we got here.
                    done();
                }
            });
            setTimeout(function() {
                that.client.write(that.jsonToString({"ImproperActionKey": "some action", "arg": "Here be an arg[s]"}));
            }, 500);
        });

        it('should respond with an \"misunderstood command message\" if the command\'s \'arg\' key could not be understood', function(done) {
            var str = InvalidCommandHelper.generateErrorMsgStr(config.Error.cmd_misunderstood);

            that.client.on('data', function(d) {
                if(d.toString('utf8') === str) {
                    assert.equal(true, true); // Assert true because we got here.
                    done();
                }
            });
            setTimeout(function() {
                that.client.write(that.jsonToString({"action": "some action", "ImproperArgKey": "Here be an arg[s]"}));
            }, 500);
        });

        it('should respond with an \"invalid action message\" if the command\'s action was invalid', function(done) {
            var str = InvalidCommandHelper.generateErrorMsgStr(config.Error.cmd_action_invalid);

            that.client.on('data', function(d) {
                if(d.toString('utf8') === str) {
                    assert.equal(true, true);
                    done();
                }
            });
            setTimeout(function() {
                that.client.write(that.jsonToString({"action": "invalid", "arg": "Here be an args[s]"}));
            }, 500);
        });

        it('should respond with an \"invalid arg message\" if the command\'s arg was invalid', function(done) {
            // TODO...
            assert.equal(true, true);
            done();
        });

        it('should respond with an \"unhandled command message\" if the command could not be handled', function(done) {
            var str = InvalidCommandHelper.generateErrorMsgStr(config.Error.cmd_action_unhandled);

            that.client.on('data', function(d) {
                if(d.toString('utf8') === str) {
                    assert.equal(true, true);
                    done();
                }
            });
            setTimeout(function() {
                that.client.write(that.jsonToString({"action": "unhandled", "arg": "Here be an arg[s]"}));
            }, 500);
        });
    });
});