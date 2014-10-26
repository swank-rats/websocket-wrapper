var
    /**
     * Type for voter event
     * @type {string}
     */
    EVENT_TYPE_VOTER = 'voter',

    /**
     * Type for inform event
     * @type {string}
     */
    EVENT_TYPE_INFORM = 'inform',

    /**
     * Prototype for event
     * @param {String} name
     * @param {String} type
     * @constructor
     */
    Event = function(name, type) {
        /**
         * Name of event
         * @type {String}
         */
        this.name = name;

        /**
         * Type of event
         * @type {String}
         */
        this.type = type;

        /**
         * Handler array for event
         * @type {Array}
         * @private
         */
        this._handlers = [];
    },

    /**
     * Prototype for voter-event
     * @param {String} name
     * @constructor
     */
    VoterEvent = function(name) {
        Event.call(name, EVENT_TYPE_VOTER);
    };

/**
 * Register an event to the event
 * @param {function} handler
 */
Event.prototype.register = function(handler) {
    this._handlers.push(handler);
};

VoterEvent.prototype = Object.create(Event.prototype);

module.exports = function(eventNames) {
    /**
     * Constant type voter
     * @type {string}
     */
    this.EVENT_TYPE_VOTER = EVENT_TYPE_VOTER;
    /**
     * Constant type inform
     * @type {string}
     */
    this.EVENT_TYPE_INFORM = EVENT_TYPE_INFORM;

    /**
     * Register a callable event
     * @param eventName
     */
    this.registerEvent = function(eventName) {
        _handler[eventName] = [];
    };

    this.registerHandler = function(event, handler) {

    };

    if (Array.isArray(eventNames)) {
        for (var i = 0, len = eventNames.length; i < len; i++) {
            this.registerEvent(eventNames[i]);
        }
    }
};
