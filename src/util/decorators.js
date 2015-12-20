/**
 * @module decorators.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

import { $injectionBinder } from   '../services/injector';

const INJECTOR = (c, n, f) => {
    if (typeof c === 'function' && typeof n === 'undefined') {
        return $injectionBinder(c);
    }

    c[ n ] = f.value = $injectionBinder(f.value);
};
export {
    INJECTOR as injector,
    INJECTOR as inject
};