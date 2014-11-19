var Websocket = require('ws').Server,
    Listener = require('./listener').Listener,
    Events = require('./events').EventSystem,
    Util = require('./util.js'),

    EVENT_PRE_MESSAGE = 'pre_message',
    EVENT_MESSAGE = 'message',
    EVENT_CONNECTION = 'connection',

    WebsocketWrapper = function(config) {
        /**
         * id of object
         * @type {string}
         */
        this.id = Util.guid();

        /**
         * Websocket Instance
         * @type {Websocket}
         * @private
         */
        this._ws = new Websocket(config);

        /**
         * Container for caching listener
         * @type {Listener}
         */
        this.listener = new Listener();

        /**
         * Container of events
         * @type {object}
         * @private
         */
        this._events = new Events();

        this._ws.wrapper = {events: this._events, listener: this.listener};

        /**
         * Register events
         */
        this._events.registerEvent(EVENT_PRE_MESSAGE, this._events.EVENT_TYPE_VOTER);
        this._events.registerEvent(EVENT_MESSAGE, this._events.EVENT_TYPE_INFORM);
        this._events.registerEvent(EVENT_CONNECTION, this._events.EVENT_TYPE_INFORM);

        /**
         * Connection event handler
         */
        this._ws.on('connection', _onConnection);
    };

/**
 * Stops current websocket server
 */
WebsocketWrapper.prototype.stop = function() {
    this._ws.close();
};

/**
 * Handles connection of new socket
 * @param {Object} socket
 * @private
 */
var _onConnection = function(socket) {
    console.log(this);

    socket.id = Util.guid();

    this.wrapper.events.fire(EVENT_CONNECTION, [socket]);

    socket.on('message', function(message) {
        if (!Util.isJsonString(message)) {
            console.error('message validate error');
            return;
        }

        _onMessage(socket, message);
    }.bind(this));

    socket.on('close', function() {
        _onClose(socket);
    }.bind(this));
};

/**
 * Parses message and delegate to listener
 * @param {Object} socket
 * @param {String} message
 * @private
 */
var _onMessage = function(socket, message) {
    var data = JSON.parse(message), result;
    data.cmd = data.cmd || 'default';

    result = this.wrapper_events.fire(EVENT_PRE_MESSAGE, [data]);

    if (result !== this.wrapper.events.EVENT_RESULT_DENIED) {
        if (!!data.to && !!this.wrapper.listener.has(data.to)) {
            this.wrapper.listener.get(data.to)[data.cmd](socket, data.params || {}, data.data || {});
        } else {
            console.warn('message ignored');
        }
    } else {
        console.warn('message not granted');
    }
};

/**
 * Handles closed socket
 * @param {Object} socket
 * @private
 */
var _onClose = function(socket) {
};

module.exports.WebsocketWrapper = WebsocketWrapper;
