'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _chalk = require('chalk');

var _angieLog = require('angie-log');

var _angieLog2 = _interopRequireDefault(_angieLog);

var $$ProviderNotFoundError = (function (_RangeError) {
    _inherits($$ProviderNotFoundError, _RangeError);

    function $$ProviderNotFoundError() {
        var name = arguments.length <= 0 || arguments[0] === undefined ? 'module' : arguments[0];

        _classCallCheck(this, $$ProviderNotFoundError);

        _angieLog2['default'].error('Cannot find ' + (0, _chalk.cyan)(name) + ' in module registry');
        _get(Object.getPrototypeOf($$ProviderNotFoundError.prototype), 'constructor', this).call(this);
    }

    return $$ProviderNotFoundError;
})(RangeError);

var $$ProviderDomainError = (function (_ReferenceError) {
    _inherits($$ProviderDomainError, _ReferenceError);

    function $$ProviderDomainError() {
        _classCallCheck(this, $$ProviderDomainError);

        _angieLog2['default'].error('No dependencies to inject');
        _get(Object.getPrototypeOf($$ProviderDomainError.prototype), 'constructor', this).call(this);
    }

    return $$ProviderDomainError;
})(ReferenceError);

var $$ProviderTypeError = (function (_TypeError) {
    _inherits($$ProviderTypeError, _TypeError);

    function $$ProviderTypeError() {
        _classCallCheck(this, $$ProviderTypeError);

        var msg = 'Models cannot be called as arguments to directives. You ' + 'may manually inject these using `$Injector.get` if you so choose';
        _angieLog2['default'].error(msg);
        _get(Object.getPrototypeOf($$ProviderTypeError.prototype), 'constructor', this).call(this);
    }

    return $$ProviderTypeError;
})(TypeError);

exports.$$ProviderNotFoundError = $$ProviderNotFoundError;
exports.$$ProviderDomainError = $$ProviderDomainError;
exports.$$ProviderTypeError = $$ProviderTypeError;