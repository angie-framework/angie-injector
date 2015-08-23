/**
 * @module $InjectorProvider.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

// System Modules
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _chalk = require('chalk');

var bread = function bread(v) {
    return (0, _chalk.bold)((0, _chalk.red)(v));
};
var $$injectorRoot = undefined;

/**
 * @desc Handles dependency injection, will return one or many arguments passed
 * as a string or an array.
 * @since 0.0.1
 * @access public
 * @example $Injector.get('test');
 */

var $InjectorProvider = (function () {
    function $InjectorProvider() {
        _classCallCheck(this, $InjectorProvider);
    }

    /**
     * @desc Responsible for binding of dependencies to functions
     * @since 0.0.1
     * @access public
     * @param {function} The function to which values are being provided
     * @returns {function} Bound function
     */

    _createClass($InjectorProvider, null, [{
        key: 'get',

        /**
         * @desc Responsible for routing of dependencies
         * @since 0.0.1
         * @access public
         * @param {object|string} The name or array of names of providers to fetch
         * @returns {object|string|number|Array<>|boolean} The provider value
         * @example $Injector.get('$scope'); // = { $id: 1 }
         */
        value: function get() {

            // Declare the root from which dependencies are provided and check keys
            $$injectorRoot = $$injectorRoot || global.app || {};
            if (!Object.keys($$injectorRoot).length) {
                throw new $$ProviderDomainError();
            }

            var registrar = undefined,
                providers = [],
                args = arguments[0] instanceof Array ? arguments[0] : Array.from(arguments),
                type = arguments[0] instanceof Array && arguments[1] ? arguments[1] : null;

            // Check to see if a registrar exists
            if (typeof $$injectorRoot.$$registry === 'object') {
                registrar = $$injectorRoot.$$registry;
            }

            // Check to see if there are any preceeding empty args
            if (args.length && args[0] === '') {
                args.shift();
            }

            args.forEach(function (arg) {
                var provider = undefined;

                // Doing this for safety reasons...if the arg didn't come from IB,
                // it potentially has unsafe spaces, underscores
                arg = arg.toString().replace(/[_\s]/g, '');

                // Rename convention for the $scope service
                if (arg === 'scope') {
                    arg = '$scope';
                } else if (registrar && registrar[arg] === 'Model' && type && type === 'directive') {
                    throw new $$ProviderTypeError();
                }

                // Try to find the provider in the registrar or the declared object
                // else return;
                try {
                    provider = registrar ? $$injectorRoot[registrar[arg]][arg] : $$injectorRoot[arg];
                    if (provider) {
                        providers.push(provider);
                        return;
                    }
                    throw new Error();
                } catch (e) {

                    // If no provider could be found, there is a big problem
                    throw new $$ProviderNotFoundError(arg);
                }
            });
            return providers.length > 1 ? providers : providers[0] ? providers[0] : [];
        }

        /**
         * @desc Specifies the root object from which dependencies are fetched
         * @since 0.0.1
         * @access public
         * @param {object} r [param={}] The object from which dependencies are
         * fetched
         * @returns {object} The root object vaule
         * @example $Injector.$specifyInjectorRoot({});
         */
    }, {
        key: '$specifyInjectorRoot',
        value: function $specifyInjectorRoot() {
            var r = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            $$injectorRoot = r;
            return r;
        }
    }]);

    return $InjectorProvider;
})();

function $injectionBinder(fn, type) {
    if (fn === undefined) fn = function () {
        return undefined;
    };

    var str = fn.toString(),
        args = str.match(/(function.*)?\(.*\)(\s+\=\>)?/g),
        providers = [];

    args = args.map(function (v) {
        return v.replace(/[_\s]/g, '');
    });
    if (args && args.length) {

        // TODO this is probably one of the worst RegExps ever written. It is
        // intended to match:
        // Anonymous functions
        // Named functions
        // Arrow functions
        // Closing brackets
        args = args[0].replace(/(\(|function(\s+)?([^\)\(]+)?(\s+)?\(|\)(\s+)?(=>)?(\s+)?)/g, '').split(',').map(function (v) {
            return v.trim();
        });
        providers = $InjectorProvider.get.apply(global.app, args, type);
    }
    return typeof providers === 'object' ? fn.bind.apply(fn, [null].concat(_toConsumableArray(providers))) : providers ? fn.bind(null, providers) : fn.bind(null);
}

/**
 * @desc Handles Errors for unfound injection resources based on RangeError
 * @since 0.0.1
 * @extends {RangeError}
 * @access private
 */

var $$ProviderNotFoundError = (function (_RangeError) {
    _inherits($$ProviderNotFoundError, _RangeError);

    function $$ProviderNotFoundError(name) {
        _classCallCheck(this, $$ProviderNotFoundError);

        console.log(bread('Cannot find ' + name + ' <-- ' + name + 'Provider'));
        _get(Object.getPrototypeOf($$ProviderNotFoundError.prototype), 'constructor', this).call(this);
    }

    /**
     * @desc Handles Errors for empty $Injector requests based on ReferenceError
     * @since 0.0.1
     * @extends {ReferenceError}
     * @access private
     */
    return $$ProviderNotFoundError;
})(RangeError);

var $$ProviderDomainError = (function (_ReferenceError) {
    _inherits($$ProviderDomainError, _ReferenceError);

    function $$ProviderDomainError() {
        _classCallCheck(this, $$ProviderDomainError);

        console.log(bread('No dependencies to inject'));
        _get(Object.getPrototypeOf($$ProviderDomainError.prototype), 'constructor', this).call(this);
    }

    /**
     * @desc Handles Errors for empty $Injector requests based on ReferenceError
     * @since 0.0.1
     * @extends {ReferenceError}
     * @access private
     */
    return $$ProviderDomainError;
})(ReferenceError);

var $$ProviderTypeError = (function (_TypeError) {
    _inherits($$ProviderTypeError, _TypeError);

    function $$ProviderTypeError() {
        _classCallCheck(this, $$ProviderTypeError);

        console.log(bread('Models cannot be called as arguments to directives. You may ' + 'manually inject these using `$inject.get` if you so choose'));
        _get(Object.getPrototypeOf($$ProviderTypeError.prototype), 'constructor', this).call(this);
    }

    return $$ProviderTypeError;
})(TypeError);

exports['default'] = $InjectorProvider;
exports.$injectionBinder = $injectionBinder;
exports.$$ProviderDomainError = $$ProviderDomainError;
exports.$$ProviderNotFoundError = $$ProviderNotFoundError;
exports.$$ProviderTypeError = $$ProviderTypeError;