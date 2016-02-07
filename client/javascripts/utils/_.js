/**
 * Wrapped underscore to a amd module and mixin the util methods
 *
 */
var util = require('./util');
var lodash = require('lodash');

lodash.assign(lodash, util);

module.exports = lodash;
