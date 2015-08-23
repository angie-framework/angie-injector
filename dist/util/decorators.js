/**
 * @module decorators.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _services$InjectorProvider = require('../services/$InjectorProvider');

/* istanbul ignore next */
var injector = function injector(i, e, obj) {
  return (0, _services$InjectorProvider.$injectionBinder)(obj.value).call(obj.value);
};
exports.injector = injector;