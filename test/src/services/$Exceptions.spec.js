// Test Modules
import { expect } from          'chai';
import { mock } from            'simple-mock';

// System Modules
import { cyan } from            'chalk';
import $LogProvider from        'angie-log';

// Project Modules
// Use require to resolve import string literal limitations
const $Exceptions =             require(`../../../${global.TEST_ENV}/services/$Exceptions`);

describe('$Exceptions', function() {
    const noop = () => false;

    beforeEach(function() {
        mock($LogProvider, 'error', noop);
    });
    describe('$$ProviderNotFoundError', function() {
        describe('constructor', function() {
            it('test called with module', function() {

                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$ProviderNotFoundError('test');

                    /* eslint-enable */
                }).to.throw(RangeError);
                // expect($LogProvider.error.calls[0].args[0]).to.eq(
                //     `Cannot find ${cyan('test')} in module registry`
                // );
            });
            it('test called without module', function() {

                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$ProviderNotFoundError();

                    /* eslint-enable */
                }).to.throw(RangeError);
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    `Cannot find ${cyan('module')} in module registry`
                );
            });
        });
    });
    describe('$$ProviderDomainError', function() {
        describe('constructor', function() {
            it('test constructor', function() {
                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$ProviderDomainError();

                    /* eslint-enable */
                }).to.throw(ReferenceError);
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    'No dependencies to inject'
                );
            });
        });
    });
    describe('$$ProviderTypeError', function() {
        describe('constructor', function() {
            it('test constructor', function() {

                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$ProviderTypeError();

                    /* eslint-enable */
                }).to.throw(TypeError);
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    'Models cannot be called as arguments to directives. You ' +
                    'may manually inject these using `$Injector.get` if you so ' +
                    'choose'
                );
            });
        });
    });
});