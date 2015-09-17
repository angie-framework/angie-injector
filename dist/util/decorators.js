'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _services$InjectorProvider = require('../services/$InjectorProvider');

var injector = function injector(i, e, obj) {
  return (0, _services$InjectorProvider.$injectionBinder)(obj.value).call(obj.value);
};
exports.injector = injector;