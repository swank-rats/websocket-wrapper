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

        /**
         * Grant return value
         * @type {string}
         */
        this.GRANTED = 'GRANTED';

        /**
         * Deny return value
         * @type {string}
         */
        this.DENIED = 'DENIED';

        /**
         * Abstain return value
         * @type {string}
         */
        this.ABSTAIN = 'ABSTAIN';

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
 * Register an handler to the event
 * @param {function} handler
 */
Event.prototype.registerHandler = function(handler) {
    this._handlers.push(handler);
};

/**
 * Fire event
 * @param {array} parameter
 */
Event.prototype.fire = function(parameter) {
    if (!parameter) {
        parameter = [];
    }
    parameter.unshift(this);

    return this._fire(parameter);
};

/**
 * Simple fire implementation can be overridden by concrete event
 * @param {array} parameter
 * @private
 */
Event.prototype._fire = function(parameter) {
    this._handlers.forEach(function(handler) {
        handler.apply(null, parameter);
    });

    return null;
};

/**
 * Returns all handler for this event
 * @returns {Array}
 */
Event.prototype.getHandler = function() {
    return this._handlers;
};

VoterEvent.prototype = Object.create(Event.prototype);
VoterEvent.prototype.constructor = Event;

/**
 *
 * @param {array} parameter
 * @private
 */
VoterEvent.prototype._fire = function(parameter) {
    var result;

    this._handlers.forEach(function(handler) {
        handler.apply(null, parameter);
    });

    return result;
};

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

        return this._events[eventName] = createEvent(eventName, type);
    };

    /**
     * Returns all events
     * @returns {Event[]}
     */
    this.getEvents = function() {
        return this._events;
    };

    /**
     * Returns event for given event name
     * @returns {Event}
     */
    this.getEvent = function(name) {
        return this._events[name];
    };

    /**
     * Register a handler for a event
     * @param {string} event
     * @param {function} handler
     */
    this.registerHandler = function(event, handler) {
        this.getEvent(event).registerHandler(handler);
    };

    /**
     * Returns handlers for given event name
     * @param {string} event
     * @returns {function[]}
     */
    this.getHandler = function(event) {
        this.getEvent(event).getHandler();
    };

    /**
     * Fire event with given name
     * @param {string} event
     * @param {array} parameter
     */
    this.fire = function(event, parameter) {
        this.getEvent(event).fire(parameter);
    };
};
