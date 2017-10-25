const colors = require('colors');
const room = require('./room.js');

// List of all room names
var roomListings = [];

// List of all rooms, and all available functionality behind each room.
var roomDatabase = [];

module.exports = {
    init: function() {
        console.log("Room Listings Initialized".cyan);
    },
    listings: function() {
        return roomListings;
    },
    getAllUsersFromRoom: function(roomName) {
        return ["John", "Jane", "Joe", "Jacob"];
    },
    createRoom: function(name, permissions) {
        if(!roomDatabase.hasOwnProperty(rm.getName)) {
            var rm = room.newRoom();
            rm.setName(name);
            roomDatabase[rm.getName()] = rm; 
            return true;
        }
        return false;
    },
    deleteRoom: function(name) {
        console.log("%s, Room Deleted".red);
    }
};