var Websocket = require('ws').Server,

    /**
     * Container for caching listener
     * @type {Object[]}
     * @private
     */
    _listener = {},

    /**
     * Websocket Instance
     * @type {Websocket}
     * @private
     */
    _ws,

    /**
     * Generate uuid for client
     * @returns {string}
     */
    guid = function() {
        function _p8(s) {
            var p = (Math.random().toString(16) + '000000000').substr(2, 8);
            return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
        }

        return _p8() + _p8(true) + _p8(true) + _p8();
    },

    /**
     * Validate string against json
     * @param {string} json
     * @returns {boolean}
     */
    isJsonString = function(json) {
        try {
            JSON.parse(json);
        } catch (e) {
            return false;
        }
        return true;
    },

    /**
     * Initiate websocket server with given http server
     * @param {Object} config
     */
    init = function(config) {
        _ws = new Websocket(config);

        _ws.on('connection', function(socket) {
            onConnection(_ws, socket);
        });
    },

    /**
     * Stops websocket server
     */
    stop = function() {
        _ws.close();
    },

    /**
     * Handles connection of new socket
     * @param {Websocket} ws
     * @param {Object} socket
     */
    onConnection = function(ws, socket) {
        socket.id = guid();

        socket.on('message', function(message) {
            onMessage(socket, message);
        });

        socket.on('close', function() {
            onClose(socket);
        });
    },

    /**
     * Parses message and delegate to _listener
     * @param {Object} socket
     * @param {String} message
     */
    onMessage = function(socket, message) {
        if (!isJsonString(message)) {
            console.error('message validate error');
            return;
        }

        var data = JSON.parse(message),
            cmd = data.cmd || 'default';

        if (!!data.to && !!_listener.hasOwnProperty(data.to)) {
            _listener[data.to][cmd](socket, data.params || {}, data.data || {});
        } else {
            console.warn('message ignored');
        }
    },

    /**
     * Handles closed socket
     * @param {Object} socket
     */
    onClose = function(socket) {
    };

module.exports = function(config) {

    /**
     * Register listener for websockets library
     * @param {String} name
     * @param {Object} listener
     */
    this.registerListener = function(name, listener) {
        _listener[name] = listener;
    };

    /**
     * Register a handle for following events:
     *   - 'message': function(socket, message){return <boolean>;}
     *     Return false ignores the message
     *
     * @param {string} eventName
     * @param {function} handler
     */
    this.registerHandler = function(eventName, handler) {
        if (!_handler.hasOwnProperty(eventName)) {
            Console.warn('Event '+eventName + ' does not exists!');
            return;
        }
        _handler[eventName].push(handler);
    };

    /**
     * Returns listener array
     * @returns {Object[]}
     */
    this.getListener = function() {
        return _listener;
    };

    /**
     * Stops current websocket server
     */
    this.stop = function() {
        stop();
    };

    init(config);
};
