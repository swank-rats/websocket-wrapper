var Websocket = require('ws').Server,
    Events = require('./events'),

    EVENT_PRE_MESSAGE = 'pre_message',
    EVENT_MESSAGE = 'message',
    EVENT_CONNECTION = 'connection',

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
        this._ws = new Websocket(config);

        this._ws.on('connection', function(socket) {
            onConnection.call(this, socket);
        }.bind(this));

        this._events.registerEvent(EVENT_PRE_MESSAGE, this._events.EVENT_TYPE_VOTER);
        this._events.registerEvent(EVENT_MESSAGE, this._events.EVENT_TYPE_INFORM);
        this._events.registerEvent(EVENT_CONNECTION, this._events.EVENT_TYPE_INFORM);
    },

    /**
     * Stops websocket server
     */
    stop = function() {
        this._ws.close();
    },

    /**
     * Handles connection of new socket
     * @param {Object} socket
     */
    onConnection = function(socket) {
        socket.id = guid();

        this._events.fire(EVENT_CONNECTION, [socket]);

        socket.on('message', function(message) {
            onMessage.call(this, socket, message);
        }.bind(this));

        socket.on('close', function() {
            onClose.call(this, socket);
        }.bind(this));
    },

    /**
     * Parses message and delegate to listener
     * @param {Object} socket
     * @param {String} message
     */
    onMessage = function(socket, message) {
        if (!isJsonString(message)) {
            console.error('message validate error');
            return;
        }

        var data = JSON.parse(message), result;
        data.cmd = data.cmd || 'default';

        result = this._events.fire(EVENT_PRE_MESSAGE, [data]);

        if (result === this._events.EVENT_RESULT_ABSTAIN || result === this._events.EVENT_RESULT_GRANTED) {
            console.log(data);
            console.log(this._listener);
            if (!!data.to && !!this._listener.hasOwnProperty(data.to)) {
                this._listener[data.to][data.cmd](socket, data.params || {}, data.data || {});
            } else {
                console.warn('message ignored');
            }
        }else{
            console.warn('message not granted');
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
     * Eventcontainer
     * @type {object}
     * @private
     */
    this._events = new Events();

    /**
     * Container for caching listener
     * @type {Object[]}
     * @private
     */
    this._listener = {};

    /**
     * Websocket Instance
     * @type {Websocket}
     * @private
     */
    this._ws;

    /**
     * Register listener for websockets library
     * @param {String} name
     * @param {Object} listener
     */
    this.registerListener = function(name, listener) {
        console.log(name);
        this._listener[name] = listener;
    }.bind(this);

    /**
     * Register a handle for following events:
     *   - 'message': function(socket, message){return <boolean>;}
     *     Return false ignores the message
     *
     * @param {string} eventName
     * @param {function} handler
     */
    this.registerHandler = function(eventName, handler) {
    }.bind(this);

    /**
     * Returns listener array
     * @returns {Object[]}
     */
    this.getListener = function() {
        return this._listener;
    }.bind(this);

    /**
     * Stops current websocket server
     */
    this.stop = function() {
        stop.call(this);
    }.bind(this);

    init.call(this, config);

    return this;
};
