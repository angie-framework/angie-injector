/**
 * @module decorators.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

import {$injectionBinder} from   '../services/$InjectorProvider';

/* istanbul ignore next */
const injector = (i, e, obj) => $injectionBinder(obj.value).call(obj.value);
export {injector};