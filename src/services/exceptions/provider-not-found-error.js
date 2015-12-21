/**
 * @module provider-not-found-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 12/13/2015
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
        const MSG = `Cannot find ${cyan(name)} in module registry`;

        $LogProvider.error(MSG);
        throw new RangeError(MSG);
    }
}

export default $$ProviderNotFoundError;