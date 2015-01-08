'use strict';

var Websocket = require('ws').Server,
    Listener = require('./listener').Listener,
    Events = require('./events').EventSystem,
    Util = require('./util.js'),

    EVENT_PRE_MESSAGE = 'pre_message',
    EVENT_MESSAGE = 'message',
    EVENT_CONNECTION = 'connection',

    /**
     * Handles closed socket
     * @param {Object} socket
     * @private
     */
    _onClose = function(socket) {
    },

    /**
     * Parses message and delegate to listener
     * @param {Object} socket
     * @param {String} message
     * @private
     */
    _onMessage = function(socket, message) {
        var data = JSON.parse(message), result;
        data.cmd = data.cmd || 'default';

        result = this._events.fire(EVENT_PRE_MESSAGE, [data]);

        if (result !== this._events.EVENT_RESULT_DENIED) {
            if (!!data.to && !!this._listener.has(data.to)) {
                this._listener.get(data.to)[data.cmd](socket, data.params || {}, data.data || {});
            } else {
                console.warn('message ignored');
            }
        } else {
            console.warn('message not granted');
        }
    },

    /**
     * Broadcasts a message
     * @param {Websocket} wss
     * @param {String} to
     * @param {String} cmd
     * @param {Object} params
     * @param data
     */
    broadcast = function broadcast(wss, to, cmd, params, data) {
        var message = {to: to, cmd: cmd, params: params, data: data};

        for (var i in wss.clients) {
            if (wss.clients.hasOwnProperty(i)) {
                wss.clients[i].send(JSON.stringify(message));
            }
        }
    },

    /**
     * Handles connection of new socket
     * @param {Object} socket
     * @private
     */
    _onConnection = function(socket) {
        var _ws = this._ws;

        socket.id = Util.guid();

        /**
         * Broadcasts a message
         * @param {String} to
         * @param {String} cmd
         * @param {Object} params
         * @param data
         */
        socket.broadcast = function(to, cmd, params, data) {
            broadcast(_ws, to, cmd, params, data);
        };

        this._events.fire(EVENT_CONNECTION, [socket]);

        socket.on('message', function(message) {
            if (!Util.isJsonString(message)) {
                console.error('message validate error');
                return;
            }

            _onMessage.call(this, socket, message);
        }.bind(this));

        socket.on('close', function() {
            _onClose.call(this, socket);
        }.bind(this));
    },

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
        this._listener = new Listener();

        /**
         * Container of events
         * @type {object}
         * @private
         */
        this._events = new Events();

        /**
         * Register events
         */
        this._events.registerEvent(EVENT_PRE_MESSAGE, this._events.EVENT_TYPE_VOTER);
        this._events.registerEvent(EVENT_MESSAGE, this._events.EVENT_TYPE_INFORM);
        this._events.registerEvent(EVENT_CONNECTION, this._events.EVENT_TYPE_INFORM);

        /**
         * Connection event handler
         */
        this._ws.on('connection', _onConnection.bind(this));
    };

/**
 * Register a handler for event
 */
WebsocketWrapper.prototype.on = function(name, handler) {
    this._events.registerHandler(name, handler);
};

/**
 * Stops current websocket server
 */
WebsocketWrapper.prototype.stop = function() {
    this._listener.clear();

    for (var i in this._ws.clients) {
        if (this._ws.clients.hasOwnProperty(i)) {
            this._ws.clients[i].close();
        }
    }

    this._ws.clients = [];
    this._ws.close();
};

/**
 * Add listener
 * @param {String} name
 * @param {Object} listener
 */
WebsocketWrapper.prototype.addListener = function(name, listener) {
    this._listener.add(name, listener);
};

/**
 * Returns listener
 * @param {string} name
 * @returns {Object}
 */
WebsocketWrapper.prototype.getListener = function(name) {
    return this._listener.get(name);
};

module.exports.WebsocketWrapper = WebsocketWrapper;
