/**
 * @module injector.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

// Project Modules
import * as $Exceptions from    './exceptions';

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
        const FIRST_ARGUMENT_IS_ARRAY = arguments[ 0 ] instanceof Array;
        const ARGS = Array.prototype.slice.call(
            FIRST_ARGUMENT_IS_ARRAY ? arguments[ 0 ] : arguments
        );
        const LAST_ARGUMENT = ARGS.slice(-1)[ 0 ];
        const REGISTRAR = global.app.$$registry;
        let providers = [],
            scoping = {};

        if (FIRST_ARGUMENT_IS_ARRAY && typeof arguments[ 1 ] === 'object') {
            scoping = arguments[ 1 ];
        } else if (typeof LAST_ARGUMENT === 'object') {
            scoping = LAST_ARGUMENT;
        }

        if (Object.keys(scoping).length && !FIRST_ARGUMENT_IS_ARRAY) {
            ARGS.pop();
        }

        for (let arg of ARGS) {
            let provider;

            if (typeof arg !== 'string') {
                continue;
            }

            // Doing this for safety reasons...if the arg didn't come from IB,
            // it potentially has unsafe spaces and underscores
            arg = arg.toString().replace(/^(_){0,2}|(_){0,2}$|\s/g, '').trim();
            if (
                REGISTRAR && REGISTRAR[ arg ] === 'Models' &&
                scoping.type && scoping.type === 'directive'
            ) {
                throw new $Exceptions.$$ProviderTypeError();
            }

            // Try to find the provider in the registrar or the declared object
            try {
                provider = app[ REGISTRAR[ arg ] ][ arg ];
            } catch (e) {

                // These are session controlled and we need to make sure
                // we pull out the right one
                if (typeof scoping.type === 'string') {
                    const TYPE = scoping.type.toLowerCase();
                    if (arg === '$scope' && [
                        'controller', 'directive', 'view', 'component'
                    ].indexOf(TYPE) > -1) {
                        provider = scoping[ arg ].val;
                    } else if (
                        [ '$request', '$response' ].indexOf(arg) > -1 &&
                        TYPE === 'controller'
                    ) {
                        provider = scoping[ arg ].val;
                    }
                }
            }

            if (provider) {
                providers.push(provider);
            } else {
                throw new $Exceptions.$$ProviderNotFoundError(arg);
            }
        }

        if (providers.length) {
            if (providers.length > 1) {
                return providers;
            }

            return providers[ 0 ];
        }

        return providers;
    }
}

/* eslint-disable no-nested-ternary */
/**
 * @desc Responsible for binding of dependencies to functions
 * @param {function} fn The function to which values are being provided
 * @param {string} type An optional Angie module type
 * @returns {function} Bound function
 * @since 0.0.1
 * @access public
 */
function $injectionBinder(fn, scoping) {
    const ARGS = $$arguments(fn);
    const PROVIDERS = $Injector.get(ARGS, scoping);

    if (PROVIDERS instanceof Array) {
        return fn.bind(null, ...PROVIDERS);
    }

    return fn.bind(null, PROVIDERS);
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
            args = str.match(
                /function([^\)\(]+)?\(([^\)\(]+)?\)|\(?([^\)\(]+)?\)?\s+?\=\>/g
            );

        if (args && args.length) {

            // Replace all of the "function" characters
            let argStr = args.map(
                v => v.replace(/(function.*)\(|[\s\=\>\)\(]/g, '')
            )[ 0 ];

            // Split our argument string and pass it back to the injector
            if (argStr.length) {
                return argStr.split(',').map(v => v.trim());
            }
        }
    }
    return [];
}

export default $Injector;
export { $injectionBinder, $$arguments };