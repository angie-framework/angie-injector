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
 * @extends {RangeError}
 * @access private
 */
class $$ProviderNotFoundError extends RangeError {

    /**
     * @desc Throws a RangeError based on an unfound module name
     * @param {string} name Module name that was not found
     * @since 0.0.1
     * @access private
     */
    constructor(name = 'module') {
        $LogProvider.error(`Cannot find ${cyan(name)} in module registry`);
        super();
    }
}

/**
 * @desc Handles Errors for empty $Injector requests
 * @since 0.0.1
 * @extends {ReferenceError}
 * @access private
 */
class $$ProviderDomainError extends ReferenceError {

    /**
     * @desc Throws a ReferenceError
     * @since 0.0.1
     * @access private
     */
    constructor() {
        $LogProvider.error('No dependencies to inject');
        super();
    }
}

/**
 * @desc Handles Errors for empty $Injector requests
 * @since 0.0.1
 * @extends {TypeError}
 * @access private
 */
class $$ProviderTypeError extends TypeError {

    /**
     * @desc Throws a TypeError
     * @since 0.0.1
     * @access private
     */
    constructor() {
        const msg = 'Models cannot be called as arguments to directives. You ' +
            'may manually inject these using `$Injector.get` if you so choose';
        $LogProvider.error(msg);
        super();
    }
}

export {
    $$ProviderNotFoundError,
    $$ProviderDomainError,
    $$ProviderTypeError
};