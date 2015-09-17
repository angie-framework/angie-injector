'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _chalk = require('chalk');

var _angieLog = require('angie-log');

var _angieLog2 = _interopRequireDefault(_angieLog);

var _$Exceptions = require('./$Exceptions');

var $Exceptions = _interopRequireWildcard(_$Exceptions);

var $$injectorRoot = undefined;

var $Injector = (function () {
    function $Injector() {
        _classCallCheck(this, $Injector);
    }

    _createClass($Injector, null, [{
        key: 'get',
        value: function get() {
            $$injectorRoot = $$injectorRoot || global.app || {};

            if (!Object.keys($$injectorRoot).length) {
                throw new $Exceptions.$$ProviderDomainError();
            }

            var registrar = undefined,
                providers = [],
                args = arguments[0] instanceof Array ? arguments[0] : Array.from(arguments),
                type = arguments[0] instanceof Array && arguments[1] ? arguments[1] : null;

            if (typeof $$injectorRoot.$$registry === 'object') {
                registrar = $$injectorRoot.$$registry;
            }

            args.forEach(function (arg) {
                var provider = undefined;

                arg = arg.toString().replace(/(^(_)|[\s]|(_)$)/g, '');

                if (arg === 'scope') {
                    arg = '$scope';
                } else if (registrar && registrar[arg] === 'Model' && type && type === 'directive') {
                    throw new $Exceptions.$$ProviderTypeError();
                }

                try {
                    provider = registrar ? $$injectorRoot[registrar[arg]][arg] : $$injectorRoot[arg];
                    if (provider) {
                        providers.push(provider);
                        return;
                    }
                    throw new Error();
                } catch (e) {
                    throw new $Exceptions.$$ProviderNotFoundError(arg);
                }
            });
            return providers.length > 1 ? providers : providers[0] ? providers[0] : [];
        }
    }, {
        key: '$specifyInjectorRoot',
        value: function $specifyInjectorRoot() {
            var r = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            $$injectorRoot = r;
            return r;
        }
    }]);

    return $Injector;
})();

function $injectionBinder(fn, type) {
    var args = $$arguments(fn),
        providers = $Injector.get.apply(global.app, args, type) || [];
    return providers instanceof Array ? fn.bind.apply(fn, [null].concat(_toConsumableArray(providers))) : providers ? fn.bind(null, providers) : fn.bind(null);
}

function $$arguments() {
    var fn = arguments.length <= 0 || arguments[0] === undefined ? function () {
        return false;
    } : arguments[0];

    if (typeof fn === 'function') {
        var str = fn.toString(),
            args = str.match(/(function.*)?\(.*\)(\s+\=\>)?/g);

        if (args && args.length) {
            args = args.map(function (v) {
                return v.replace(/[_\s]/g, '');
            });

            var argStr = args[0].replace(/(\(|function(\s+)?([^\)\(]+)?(\s+)?\(|\)(\s+)?(=>)?(\s+)?)/g, '');

            if (argStr.length) {
                return argStr.split(',').map(function (v) {
                    return v.trim();
                });
            }
        }
    }
    return [];
}

exports['default'] = $Injector;
exports.$injectionBinder = $injectionBinder;
exports.$$arguments = $$arguments;