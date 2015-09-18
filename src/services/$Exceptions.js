/**
 * @module $Exceptions.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

// System Modules
import { cyan } from        'chalk';
import $LogProvider from    'angie-log';

/**
 * @desc Handles Errors for unfound injection resources
 * @since 0.0.1
 * @access private
 */
class $$ProviderNotFoundError {

    /**
     * @desc Throws a RangeError based on an unfound module name
     * @param {string} name Module name that was not found
     * @since 0.0.1
     * @access private
     */
    constructor(name = 'module') {
        const msg = `Cannot find ${cyan(name)} in module registry`;
        $LogProvider.error(msg);
        throw new RangeError(msg);
    }
}

/**
 * @desc Handles Errors for empty $Injector requests
 * @since 0.0.1
 * @access private
 */
class $$ProviderDomainError {

    /**
     * @desc Throws a ReferenceError
     * @since 0.0.1
     * @access private
     */
    constructor() {
        const msg = 'No dependencies to inject';
        $LogProvider.error(msg);
        throw new ReferenceError(msg);
    }
}

/**
 * @desc Handles Errors for empty $Injector requests
 * @since 0.0.1
 * @access private
 */
class $$ProviderTypeError {

    /**
     * @desc Throws a TypeError
     * @since 0.0.1
     * @access private
     */
    constructor() {
        const msg = 'Models cannot be called as arguments to directives. You ' +
            'may manually inject these using `$Injector.get` if you so choose';
        $LogProvider.error(msg);
        throw new TypeError(msg);
    }
}

export {
    $$ProviderNotFoundError,
    $$ProviderDomainError,
    $$ProviderTypeError
};