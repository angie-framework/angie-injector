// Test Modules
import { expect, assert } from  'chai';
import simple, { mock } from    'simple-mock';

// System Modules
import { cyan } from            'chalk';
import $LogProvider from        'angie-log';

// Project Modules
import * as $Exceptions from    '../../../dist/services/$Exceptions';

describe('$Exceptions', function() {
    const noop = () => false;

    beforeEach(function() {
        mock($LogProvider, 'error', noop);
    });
    afterEach(simple.restore);
    describe('$$ProviderNotFoundError', function() {
        beforeEach(function() {
            mock(RangeError.prototype, 'constructor', noop);
        });
        describe('constructor', function() {
            it('test called with module', function() {

                /* eslint-disable */
                new $Exceptions.$$ProviderNotFoundError('test');

                /* eslint-enable */
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    `Cannot find ${cyan('test')} in module registry`
                );
                assert(RangeError.prototype.constructor.called);
            });
            it('test called without module', function() {

                /* eslint-disable */
                new $Exceptions.$$ProviderNotFoundError();

                /* eslint-enable */
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    `Cannot find ${cyan('module')} in module registry`
                );
                assert(RangeError.prototype.constructor.called);
            });
        });
    });
    describe('$$ProviderDomainError', function() {
        beforeEach(function() {
            mock(ReferenceError.prototype, 'constructor', noop);
        });
        describe('constructor', function() {
            it('test constructor', function() {

                /* eslint-disable */
                new $Exceptions.$$ProviderDomainError();

                /* eslint-enable */
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    'No dependencies to inject'
                );
                assert(ReferenceError.prototype.constructor.called);
            });
        });
    });
    describe('$$ProviderTypeError', function() {
        beforeEach(function() {
            mock(TypeError.prototype, 'constructor', noop);
        });
        describe('constructor', function() {
            it('test constructor', function() {

                /* eslint-disable */
                new $Exceptions.$$ProviderTypeError();

                /* eslint-enable */
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    'Models cannot be called as arguments to directives. You ' +
                    'may manually inject these using `$Injector.get` if you so ' +
                    'choose'
                );
                assert(TypeError.prototype.constructor.called);
            });
        });
    });
});