var
    /**
     * Listener object
     * @type {Object}
     * @private
     */
    _listener = {},

    /**
     * Constructor for listener container
     * @constructor
     */
    Listener = function() {
    };

/**
 * Add a listener with given name
 * @param {String} name
 * @param {Object} listener
 */
Listener.prototype.add = function(name, listener) {
    _listener[name] = new Object(listener);
};

/**
 * Indicates if listener with given name exists
 * @param {String} name
 * @return {Boolean}
 */
Listener.prototype.has = function(name) {
    return _listener.hasOwnProperty(name);
};

/**
 * Returns listener with given name
 * @param {String} name
 * @return {Object}
 */
Listener.prototype.get = function(name) {
    if (!!name) {
        return _listener[name];
    } else {
        return _listener;
    }
};

/**
 * Clears listener container
 */
Listener.prototype.clear = function() {
    _listener = {};
};

module.exports.Listener = Listener;
