/**
 * @module provider-domain-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 12/13/2015
 */

// System Modules
import { cyan } from        'chalk';
import $LogProvider from    'angie-log';

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
        const MSG = 'No dependencies to inject';

        $LogProvider.error(MSG);
        throw new ReferenceError(MSG);
    }
}

export default $$ProviderDomainError;