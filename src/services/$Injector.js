/**
 * @module $Injector.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

// Project Modules
import * as $Exceptions from    './$Exceptions';

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
        let registrar = global.app.$$registry,
            providers = [],
            firstArgumentIsArr = arguments[ 0 ] instanceof Array,
            args = Array.prototype.slice.call(
                firstArgumentIsArr ? arguments[ 0 ] : arguments
            ),
            scoping = firstArgumentIsArr &&
                typeof arguments[ 1 ] === 'object' ?
                    arguments[ 1 ] : typeof args.slice(-1)[ 0 ] === 'object' ?
                        args.slice(-1)[ 0 ] : {};

        if (Object.keys(scoping).length && !firstArgumentIsArr) {
            args.pop();
        }

        for (let arg of args) {
            let provider;

            if (typeof arg !== 'string') {
                continue;
            }


            // Doing this for safety reasons...if the arg didn't come from IB,
            // it potentially has unsafe spaces and underscores
            arg = arg.toString().replace(/^(_){0,2}|(_){0,2}$|\s/g, '').trim();
            if (
                registrar && registrar[ arg ] === 'Model' &&
                scoping.type && scoping.type === 'directive'
            ) {
                throw new $Exceptions.$$ProviderTypeError();
            }

            // Try to find the provider in the registrar or the declared object
            try {
                provider = app[ registrar[ arg ] ][ arg ];
            } catch(e) {

                // These are session controlled and we need to make sure
                // we pull out the right one
                if (
                    arg === '$scope' &&
                    /controller|directive/.test(scoping.type)
                ) {
                    provider = scoping[ arg ].val;
                } else if (
                    /\$(request|response)/.test(arg) &&
                    scoping.type === 'Controller'
                ) {
                    provider = scoping[ arg ].val;
                }
            }

            if (provider) {
                providers.push(provider);
            } else {
                throw new $Exceptions.$$ProviderNotFoundError(arg);
            }
        }

        return providers.length > 1 ? providers : providers[ 0 ] ?
            providers[ 0 ] : [];
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
function $injectionBinder(fn, scoping) {
    const args = $$arguments(fn),
        providers = $Injector.get(args, scoping);
    return providers instanceof Array ?
        fn.bind(null, ...providers) : providers ?
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
            args = str.match(
                /function([^\)\(]+)?\(([^\)\(]+)?\)|\(?([^\)\(]+)?\)?\s+?\=\>/g
            );

        if (args && args.length) {

            // Replace all of the "function" characters
            let argStr = args.map(
                v => v.replace(/(function.*)\(|[\s\=\>\)\(]/g, '')
            )[0];

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