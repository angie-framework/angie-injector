'use strict'; 'use strong';

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
                arguments[0] : Array.from(arguments);

        // Check to see if a registrar exists
        if (typeof $$injectorRoot.$registry === 'object') {
            registrar = $$injectorRoot.$registry;
        }

        // Check to see if there are any preceeding empty args
        if (args.length && args[0] === '') {
            args.shift();
        }

        args.forEach(function(arg) {
            let provider;

            arg = arg.trim();

            // Rename convention for the $scope service
            if (arg === 'scope') {
                arg = '$scope';
            }

            // Try to find the provider in the registrar or the declared object
            // else return;
            try {
                provider = registrar ?
                    $$injectorRoot[ registrar[ arg ] ][ arg ] :
                    $$injectorRoot[ arg ]
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
function $injectionBinder(fn) {
    let str = fn.toString(),
        args = str.match(/(function.*)?\(.*\)(\s+\=\>)?/g),
        providers = [];

    args.forEach((v) => v.replace(/\s/g, ''));
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
        providers = $InjectorProvider.get.apply(global.app, args);
    }
    return typeof providers === 'object' ?
        fn.bind(null, ...providers) : providers ?
            fn.bind(null, providers) : fn.bind(null);
}

class $$ProviderNotFoundError extends RangeError {
    constructor(name) {
        super(bread(`Cannot find ${name} <-- ${name}Provider`));
    }
}

class $$ProviderDomainError extends ReferenceError {
    constructor() {
        super(bread('No dependencies to inject'));
    }
}

export default $InjectorProvider;
export {
    $injectionBinder,
    $$ProviderDomainError,
    $$ProviderNotFoundError
};