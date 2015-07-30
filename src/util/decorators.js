'use strict'; 'use strong';

import {$injectionBinder} from   '../services/$InjectorProvider';

/* istanbul ignore next */
const injector = (i, e, obj) => $injectionBinder(obj.value).call(obj.value);
export {injector};