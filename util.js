/**
 * Generate uuid for client
 * @returns {string}
 */
module.exports.guid = function() {
    function _p8(s) {
        var p = (Math.random().toString(16) + '000000000').substr(2, 8);
        return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
    }

    return _p8() + _p8(true) + _p8(true) + _p8();
};

/**
 * Validate string against json
 * @param {string} json
 * @returns {boolean}
 */
module.exports.isJsonString = function(json) {
    try {
        JSON.parse(json);
    } catch (e) {
        return false;
    }

    return true;
};
