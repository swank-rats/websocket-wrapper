var Listener = function() {
    /**
     * Listener objects
     * @type {{}}
     * @private
     */
    this._listener = {};
};

/**
 * Add a listener with given name
 * @param {String} name
 * @param {Object} listener
 */
Listener.prototype.add = function(name, listener) {
    this._listener[name] = new Object(listener);
};

/**
 * Indicates if listener with given name exists
 * @param {String} name
 * @return {Boolean}
 */
Listener.prototype.has = function(name) {
    return this._listener.hasOwnProperty(name);
};

/**
 * Returns listener with given name
 * @param {String} name
 * @return {Object}
 */
Listener.prototype.get = function(name) {
    if (!!name) {
        return this._listener[name];
    } else {
        return this._listener;
    }
};

module.exports.Listener = Listener;
