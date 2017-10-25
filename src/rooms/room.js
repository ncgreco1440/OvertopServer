module.exports = {
    room: function() {
        var name = "",
            users = [];

        return {
            setName: function(rmName) {
                name = trim(rmName);
            },
            getName: function() {
                return name;
            },
            empty: function() {
                users = [];
            },
            users: function() {
                return users;
            },
            addUser: function(user) {
                users.push(user);
            },
            removeUser: function(user) {
                users.splice(users.indexOf(user), 1);    
            }
        };
    }
};