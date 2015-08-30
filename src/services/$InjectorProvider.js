/**
 * @module $InjectorProvider.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

// System Modules
import {bold, red} from   'chalk';

const bread = (v) => bold(red(v));
let $$injectorRoot;

/**
 * @desc Handles dependency injection, will return one or many arguments passed
 * as a string or an array.
 * @since 0.0.1
 * @access public
 * @example $Injector.get('test');
 */
class $InjectorProvider {

    /**
     * @desc Responsible for routing of dependencies
     * @since 0.0.1
     * @access public
     * @param {object|string} The name or array of names of providers to fetch
     * @returns {object|string|number|Array<>|boolean} The provider value
     * @example $Injector.get('$scope'); // = { $id: 1 }
     */
    static get() {

        // Declare the root from which dependencies are provided and check keys
        $$injectorRoot = $$injectorRoot || global.app || {};
        if (!Object.keys($$injectorRoot).length) {
            throw new $$ProviderDomainError();
        }

        let registrar,
            providers = [],
            args = arguments[0] instanceof Array ?
                arguments[0] : Array.from(arguments),
            type = arguments[0] instanceof Array && arguments[1] ?
                arguments[1] : null;

        // Check to see if a registrar exists
        if (typeof $$injectorRoot.$$registry === 'object') {
            registrar = $$injectorRoot.$$registry;
        }

        // Check to see if there are any preceeding empty args
        if (args.length && args[0] === '') {
            args.shift();
        }

        args.forEach(function(arg) {
            let provider;

            // Doing this for safety reasons...if the arg didn't come from IB,
            // it potentially has unsafe spaces, underscores
            arg = arg.toString().replace(/(^(_)|[\s]|(_)$)/g, '');

            // Rename convention for the $scope service
            if (arg === 'scope') {
                arg = '$scope';
            } else if (
                registrar && registrar[ arg ] === 'Model' &&
                type && type === 'directive'
            ) {
                throw new $$ProviderTypeError();
            }

            // Try to find the provider in the registrar or the declared object
            // else return;
            try {
                provider = registrar ?
                    $$injectorRoot[ registrar[ arg ] ][ arg ] :
                    $$injectorRoot[ arg ];
                if (provider) {
                    providers.push(provider);
                    return;
                }
                throw new Error();
            }
            catch(e) {

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
    static $specifyInjectorRoot(r = {}) {
        $$injectorRoot = r;
        return r;
    }
}

/**
 * @desc Responsible for binding of dependencies to functions
 * @since 0.0.1
 * @access public
 * @param {function} The function to which values are being provided
 * @returns {function} Bound function
 */
function $injectionBinder(fn = () => undefined, type) {
    let str = fn.toString(),
        args = str.match(/(function.*)?\(.*\)(\s+\=\>)?/g),
        providers = [];

    args = args.map((v) => v.replace(/[_\s]/g, ''));
    if (args && args.length) {

        // TODO this is probably one of the worst RegExps ever written. It is
        // intended to match:
        // Anonymous functions
        // Named functions
        // Arrow functions
        // Closing brackets
        args = args[0].replace(
            /(\(|function(\s+)?([^\)\(]+)?(\s+)?\(|\)(\s+)?(=>)?(\s+)?)/g,
            ''
        ).split(',').map((v) => v.trim());
        providers = $InjectorProvider.get.apply(global.app, args, type);
    }
    return typeof providers === 'object' ?
        fn.bind(null, ...providers) : providers ?
            fn.bind(null, providers) : fn.bind(null);
}

/**
 * @desc Handles Errors for unfound injection resources based on RangeError
 * @since 0.0.1
 * @extends {RangeError}
 * @access private
 */
class $$ProviderNotFoundError extends RangeError {
    constructor(name) {
        console.log(bread(`Cannot find ${name} <-- ${name}Provider`));
        super();
    }
}

/**
 * @desc Handles Errors for empty $Injector requests based on ReferenceError
 * @since 0.0.1
 * @extends {ReferenceError}
 * @access private
 */
class $$ProviderDomainError extends ReferenceError {
    constructor() {
        console.log(bread('No dependencies to inject'));
        super();
    }
}

/**
 * @desc Handles Errors for empty $Injector requests based on ReferenceError
 * @since 0.0.1
 * @extends {ReferenceError}
 * @access private
 */
class $$ProviderTypeError extends TypeError {
    constructor() {
        console.log(bread(
            'Models cannot be called as arguments to directives. You may ' +
            'manually inject these using `$Injector.get` if you so choose'
        ));
        super();
    }
}

export default $InjectorProvider;
export {
    $injectionBinder,
    $$ProviderNotFoundError,
    $$ProviderDomainError,
    $$ProviderTypeError
};