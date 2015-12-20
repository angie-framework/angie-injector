// Test Modules
import { expect } from          'chai';
import { mock } from            'simple-mock';

// System Modules
import $LogProvider from        'angie-log';

// Angie Injector Modules
const TEST_ENV = global.TEST_ENV || 'src';
const $$ProviderTypeError = require(
    `../../../../${TEST_ENV}/services/exceptions/provider-type-error`
);

describe('$$ProviderTypeError', function() {
    beforeEach(function() {
        mock($LogProvider, 'error', () => false);
    });
    it('constructor', function() {
        expect(() => new $$ProviderTypeError()).to.throw(TypeError);
        expect(
            $LogProvider.error.calls[ 0 ].args[ 0 ]
        ).to.eq(
            'Models cannot be called as arguments to directives. You ' +
            'may manually inject these using `$Injector.get` if you so choose'
        );
    });
});