/**
 * @module provider-type-error.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 12/13/2015
 */

// System Modules
import $LogProvider from    'angie-log';

/**
 * @desc Handles Errors for provider type restrictions
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
        const MSG = 'Models cannot be called as arguments to directives. You ' +
            'may manually inject these using `$Injector.get` if you so choose';

        $LogProvider.error(MSG);
        throw new TypeError(MSG);
    }
}

export default $$ProviderTypeError;