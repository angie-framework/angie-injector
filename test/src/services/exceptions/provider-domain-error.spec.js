// Test Modules
import { expect } from          'chai';
import { mock } from            'simple-mock';

// System Modules
import $LogProvider from        'angie-log';

// Angie Injector Modules
const TEST_ENV = global.TEST_ENV || 'src';
const $$ProviderDomainError = require(
    `../../../../${TEST_ENV}/services/exceptions/provider-domain-error`
);

describe('$$ProviderDomainError', function() {
    beforeEach(function() {
        mock($LogProvider, 'error', () => false);
    });
    it('constructor', function() {
        expect(() => new $$ProviderDomainError()).to.throw(ReferenceError);
        expect(
            $LogProvider.error.calls[ 0 ].args[ 0 ]
        ).to.eq('No dependencies to inject');
    });
});