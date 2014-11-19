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
     * GRANTED return value
     * @type {string}
     */
    EVENT_RESULT_GRANTED = 'GRANTED',

    /**
     * DENIED return value
     * @type {string}
     */
    EVENT_RESULT_DENIED = 'DENIED',

    /**
     * ABSTAIN return value
     * @type {string}
     */
    EVENT_RESULT_ABSTAIN = 'ABSTAIN',

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
    },

    /**
     * Prototype for voter-event
     * @param {String} name
     * @constructor
     */
    VoterEvent = function(name) {
        Event.call(this, name, EVENT_TYPE_VOTER);
    },

    /**
     * Prototype for inform-event
     * @param {String} name
     * @constructor
     */
    InformEvent = function(name) {
        Event.call(this, name, EVENT_TYPE_INFORM);
    },

    /**
     * Prototype for event system
     * @constructor
     */
    EventSystem = function() {
        /**
         * Container for events
         * @type {Event[]}
         * @private
         */
        this._events = {};
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
    var result = EVENT_RESULT_ABSTAIN, item;

    this._handlers.forEach(function(handler) {
        item = handler.apply(null, parameter);

        if (item === EVENT_RESULT_GRANTED && result === EVENT_RESULT_ABSTAIN) {
            result = item;
        } else if (item === EVENT_RESULT_DENIED) {
            result = item;
        }
    }.bind(this));

    return result;
};

InformEvent.prototype = Object.create(Event.prototype);
InformEvent.prototype.constructor = Event;

/**
 * Constant type voter
 * @type {string}
 */
EventSystem.prototype.EVENT_TYPE_VOTER = EVENT_TYPE_VOTER;

/**
 * Constant type inform
 * @type {string}
 */
EventSystem.prototype.EVENT_TYPE_INFORM = EVENT_TYPE_INFORM;

/**
 * Constant return value granted
 * @type {string}
 */
EventSystem.prototype.EVENT_RESULT_GRANTED = EVENT_RESULT_GRANTED;

/**
 * Constant return value granted
 * @type {string}
 */
EventSystem.prototype.EVENT_RESULT_DENIED = EVENT_RESULT_DENIED;

/**
 * Constant return value granted
 * @type {string}
 */
EventSystem.prototype.EVENT_RESULT_ABSTAIN = EVENT_RESULT_ABSTAIN;

/**
 * Register a callable event
 * @param {string} eventName
 * @param {string} type
 */
EventSystem.prototype.registerEvent = function(eventName, type) {
    if (this._events.hasOwnProperty(eventName)) {
        throw 'event ' + eventName + ' already registered';
    }

    return this._events[eventName] = createEvent(eventName, type);
};

/**
 * Returns all events
 * @returns {Event[]}
 */
EventSystem.prototype.getEvents = function() {
    return this._events;
};

/**
 * Returns event for given event name
 * @returns {Event}
 */
EventSystem.prototype.getEvent = function(name) {
    return this._events[name];
};

/**
 * Register a handler for a event
 * @param {string} event
 * @param {function} handler
 */
EventSystem.prototype.registerHandler = function(event, handler) {
    this.getEvent(event).registerHandler(handler);
};

/**
 * Returns handlers for given event name
 * @param {string} event
 * @returns {function[]}
 */
EventSystem.prototype.getHandler = function(event) {
    this.getEvent(event).getHandler();
};

/**
 * Fire event with given name
 * @param {string} event
 * @param {array} parameter
 */
EventSystem.prototype.fire = function(event, parameter) {
    return this.getEvent(event).fire(parameter);
};

module.exports.EventSystem = EventSystem;
