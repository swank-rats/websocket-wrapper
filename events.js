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
     * Factory for event objects
     * @param {string} name
     * @param {string} type
     * @return {Event}
     */
    createEvent = function(name, type) {
        if (type === EVENT_TYPE_VOTER) {
            return new VoterEvent(name);
        } else if (type === EVENT_TYPE_INFORM) {
            return new InformEvent(name);
        } else {
            throw 'type not implemented';
        }
    },

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

        return this;
    },

    /**
     * Prototype for voter-event
     * @param {String} name
     * @constructor
     */
    VoterEvent = function(name) {
        Event.call(this, name, EVENT_TYPE_VOTER);

        return this;
    },

    /**
     * Prototype for voter-event
     * @param {String} name
     * @constructor
     */
    InformEvent = function(name) {
        Event.call(this, name, EVENT_TYPE_INFORM);

        return this;
    };

/**
 * Register an event to the event
 * @param {function} handler
 */
Event.prototype.register = function(handler) {
    this._handlers.push(handler);
};

VoterEvent.prototype = Object.create(Event.prototype);
VoterEvent.prototype.constructor = Event;

InformEvent.prototype = Object.create(Event.prototype);
InformEvent.prototype.constructor = Event;

module.exports = function() {
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
     * Container for events
     * @type {Object}
     * @private
     */
    this._events = {};

    /**
     * Register a callable event
     * @param {string} eventName
     * @param {string} type
     */
    this.registerEvent = function(eventName, type) {
        if (this._events.hasOwnProperty(eventName)) {
            throw 'event already registered';
        }

        this._events[eventName] = createEvent(eventName, type);
    };

    /**
     * Returns handles for given event name
     * @returns {Event[]}
     */
    this.getEvents = function() {
        return this._events;
    };

    /**
     * Register a handler for a event
     * @param {string} event
     * @param {function} handler
     */
    this.registerHandler = function(event, handler) {
    };

    /**
     * Returns handles for given event name
     * @param {string} eventName
     * @returns {function[]}
     */
    this.getHandler = function(eventName) {
    };
};
