// Test Modules
import { expect } from          'chai';
import { mock } from            'simple-mock';

// System Modules
import { cyan } from            'chalk';
import $LogProvider from        'angie-log';

// Angie Injector Modules
const TEST_ENV =                global.TEST_ENV || 'src',
    $$ProviderNotFoundError =   require(`../../../../${TEST_ENV}/services/exceptions/provider-not-found-error`);

describe('$$ProviderNotFoundError', function() {
    beforeEach(function() {
        mock($LogProvider, 'error', () => false);
    });
    describe('constructor', function() {
        it('test default', function() {
            const MSG = `Cannot find ${cyan('module')} in module registry`;

            expect(() => new $$ProviderNotFoundError()).to.throw(RangeError);
            expect($LogProvider.error.calls[0].args[0]).to.eq(MSG);
        });
        it('test module type passed', function() {
            const MSG = `Cannot find ${cyan('Controller')} in module registry`;

            expect(
                () => new $$ProviderNotFoundError('Controller')
            ).to.throw(RangeError);
            expect($LogProvider.error.calls[0].args[0]).to.eq(MSG);
        });
    });
});