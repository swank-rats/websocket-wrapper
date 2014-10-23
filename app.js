var Websocket = require('ws').Server;

module.exports = function(config) {
    var ws = new Websocket(config);

    ws.on('connection', function() {
    });
};
