/**
 * @module $Injector.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

// Project Modules
import * as $Exceptions from    './$Exceptions';

let $$injectorRoot;

/**
 * @desc Handles dependency injection, will return one or many arguments passed
 * as a string or an array.
 * @since 0.0.1
 * @access public
 * @example $Injector.get('test');
 */
class $Injector {

    /**
     * @desc Responsible for routing of dependencies
     * @param {object|string} The name or array of names of providers to fetch
     * @returns {object|string|number|Array<>|boolean} The provider value
     * @todo Replace `Array.prototype.slice.call` with `Array.from` when it is
     * supported without the polyfill
     * @since 0.0.1
     * @access public
     * @example $Injector.get('$scope'); // = { $id: 1 }
     */
    static get() {

        // Declare the root from which dependencies are provided and check keys
        $$injectorRoot = $$injectorRoot || global.app || {};

        if (!Object.keys($$injectorRoot).length) {
            throw new $Exceptions.$$ProviderDomainError();
        }

        let registrar,
            providers = [],
            args = arguments[0] instanceof Array ?
                arguments[0] : Array.prototype.slice.call(arguments),
            type = arguments[0] instanceof Array && arguments[1] ?
                arguments[1] : null;

        // Check to see if a registrar exists
        if (typeof $$injectorRoot.$$registry === 'object') {
            registrar = $$injectorRoot.$$registry;
        }

        args.forEach(function(arg) {
            let provider;

            // Doing this for safety reasons...if the arg didn't come from IB,
            // it potentially has unsafe spaces and underscores
            arg = arg.toString().replace(/^(_){0,2}|(_){0,2}$|\s/g, '').trim();

            // Rename convention for the $scope service
            if (arg === 'scope') {
                arg = '$scope';
            } else if (
                registrar && registrar[ arg ] === 'Model' &&
                type && type === 'directive'
            ) {
                throw new $Exceptions.$$ProviderTypeError();
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
                throw new $Exceptions.$$ProviderNotFoundError(arg);
            }
        });
        return providers.length > 1 ? providers : providers[0] ? providers[0] : [];
    }

    /**
     * @desc Specifies the root object from which dependencies are fetched
     * @param {object} r [param={}] The object from which dependencies are
     * fetched
     * @returns {object} The root object vaule
     * @since 0.0.1
     * @access public
     * @example $Injector.$specifyInjectorRoot({});
     */
    static $specifyInjectorRoot(r = {}) {
        $$injectorRoot = r;
        return r;
    }
}

/**
 * @desc Responsible for binding of dependencies to functions
 * @param {function} fn The function to which values are being provided
 * @param {string} type An optional Angie module type
 * @returns {function} Bound function
 * @since 0.0.1
 * @access public
 */
function $injectionBinder(fn, type) {
    const args = $$arguments(fn),
        providers = $Injector.get.apply(global.app, [ args, type ]);
    return providers instanceof Array ? fn.bind(null, ...providers) : providers ?
        fn.bind(null, providers) : fn.bind(null);
}


/**
 * @desc Parses dependencies out of a function using
 * `Function.prototype.toString`
 * @param {function} fn The function to which values are being provided
 * @returns {function} Bound function
 * @since 0.9.15
 * @access private
 */
function $$arguments(fn = () => false) {
    if (typeof fn === 'function') {
        let str = fn.toString(),

            // We need to pose this string in this fashion because arrow
            // function params may not be wrapped in parens
            args = str.match(/function.*\(.*?\)|\(?.*?\)?\s+?\=\>/g);

        if (args && args.length) {

            // Replace all of the "function" characters
            let argStr = args.map(
                v => v.replace(/(function.*)\(|[\s\=\>\)\(]/g, '')
            )[0];

            // Split our argument string and pass it back to the injector
            if (argStr.length) {
                return argStr.split(',').map((v) => v.trim());
            }
        }
    }
    return [];
}

export default $Injector;
export { $injectionBinder, $$arguments };