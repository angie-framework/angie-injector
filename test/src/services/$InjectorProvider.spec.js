// Test Modules
import {expect} from            'chai';
import simple, {mock} from      'simple-mock';

// System Modules
import {bold, red} from         'chalk';

// Angie Injector Modules
import {
    default as $Injector,
    $injectionBinder,
    $$ProviderDomainError,
    $$ProviderNotFoundError,
    $$ProviderTypeError
} from                          '../../../src/services/$InjectorProvider';

const bread = (v) => bold(red(v));

describe('$InjectorProvider', function() {
    let set = $Injector.$specifyInjectorRoot;

    afterEach(() => { set(); });
    describe('get', function() {
        let get = $Injector.get;

        it('test no dependencies to provide', function() {
            set();
            expect(get.bind(null, 'test')).to.throw($$ProviderDomainError);
        });
        describe('registrar', function() {
            beforeEach(function() {
                set({
                    constants: {
                        test: 'test',
                        test1: 'test',
                        $scope: 'test'
                    },
                    $$registry: {
                        test: 'constants',
                        test1: 'constants',
                        $scope: 'constants',
                        test4: 'Model',
                        test5: 'directive'
                    }
                });
            });
            it('test get returns nothing if no arguments', function() {
                expect(get()).to.deep.eq([]);
            });
            it('test a single argument', function() {
                expect(get('test')).to.eq('test');
            });
            it('test argument not found', function() {
                expect(
                    get.bind(null, 'test', 'test1', 'test2')
                ).to.throw($$ProviderNotFoundError);
            });
            it('test all arguments found', function() {
                set({
                    constants: {
                        test: 'test',
                        test1: 'test',
                        test3: 'test'
                    },
                    $$registry: {
                        test: 'constants',
                        test1: 'constants',
                        test3: 'constants'
                    }
                });
                expect(
                    get('test', 'test1', 'test3')
                ).to.deep.eq([ 'test', 'test', 'test' ]);
            });
            it('test directive requests Model injection', function() {
                expect(
                    get.bind(null, [ 'test4' ], 'directive')
                ).to.throw($$ProviderTypeError);
            });
        });
        describe('test no registrar', function() {
            beforeEach(function() {

                /* eslint-disable */
                set({
                    test: 'test',
                    test2: 'test2',
                    te_st: 'te_st'
                });
                /* eslint-enable */
            });
            it('test get returns nothing if no arguments', function() {
                expect(get()).to.deep.eq([]);
            });
            it('test no registrar with single argument', function() {
                expect(get('test')).to.eq('test');
            });
            it('test no registrar with single argument underscores', function() {
                expect(get('_te_st_')).to.eq('te_st');
            });
            it('test no registrar with single argument underscores', function() {
                expect(get(' te st ')).to.eq('test');
            });
            it('test argument not found', function() {
                expect(
                    get.bind(null, 'test', 'test1', 'test2')
                ).to.throw($$ProviderNotFoundError);
            });
            it('test no registrar with many arguments', function() {
                expect(
                    get('test', 'test2')
                ).to.deep.eq([ 'test', 'test2' ]);
            });
        });
        it('test scope resolves to $scope', function() {
            set({ $scope: 'test' });
            expect(get('scope')).to.eq('test');
        });
    });
    describe('$specifyInjectorRoot', function() {
        it('test with a value', function() {
            expect(set({ test: 'test' })).to.deep.eq({ test: 'test' });
        });
        it('test without a value', function() {
            expect(set()).to.deep.eq({});
        });
    });
    describe('$injectionBinder', function() {
        let args,
            binder = $injectionBinder,
            fn = function() {
                args = arguments;
            };

        beforeEach(function() {
            set({
                constants: {
                    test: 'test',
                    test1: 'test1'
                },
                $$registry: {
                    test: 'constants',
                    test1: 'constants'
                }
            });
        });
        afterEach(function() {
            set();
            args = undefined;
        });
        describe('test anonymous function', function() {
            let test = function () {},
                test1 = function(test) { test = test; },
                test2 = function(test, test1) { test = test1 = test1; };
            test.bind = test1.bind = test2.bind = fn;
            it('test empty args produces no returns', function() {
                binder(test);
                expect(args[0]).to.be.null;
                expect(args[1]).to.be.undefined;
            });
            it('test arguments with single provider', function() {
                binder(test1);
                expect(args[0]).to.be.null;
                expect(args[1]).to.eq('test');
            });
            it('test arguments with many providers', function() {
                binder(test2);
                expect(args[0]).to.be.null;
                expect(args[1]).to.eq('test');
                expect(args[2]).to.eq('test1');
            });
        });
        describe('test named function', function() {
            function test() {}
            function test1(test) { test = test; }
            function test2(test, test1) { test = test1 = test1; }
            test.bind = test1.bind = test2.bind = fn;
            it('test empty args produces no returns', function() {
                binder(test);
                expect(args[0]).to.be.null;
                expect(args[1]).to.be.undefined;
            });
            it('test arguments with single provider', function() {
                binder(test1);
                expect(args[0]).to.be.null;
                expect(args[1]).to.eq('test');
            });
            it('test arguments with many providers', function() {
                binder(test2);
                expect(args[0]).to.be.null;
                expect(args[1]).to.eq('test');
                expect(args[2]).to.eq('test1');
            });
        });
        describe('test arrow function', function() {
            let test = () => null,
                test1 = (test) => test = test,
                test2 = (test, test1) => test = test1 = test1;
            test.bind = test1.bind = test2.bind = fn;
            it('test empty args produces no returns', function() {
                binder(test);
                expect(args[0]).to.be.null;
                expect(args[1]).to.be.undefined;
            });
            it('test arguments with single provider', function() {
                binder(test1);
                expect(args[0]).to.be.null;
                expect(args[1]).to.eq('test');
            });
            it('test arguments with many providers', function() {
                binder(test2);
                expect(args[0]).to.be.null;
                expect(args[1]).to.eq('test');
                expect(args[2]).to.eq('test1');
            });
        });
    });
});

describe('$$ProviderNotFoundError', function() {
    beforeEach(function() {
        mock(RangeError.prototype, 'constructor', () => true);
    });
    afterEach(simple.restore);
    describe('constructor', function() {
        it('test called with module', function() {

            /* eslint-disable */
            new $$ProviderNotFoundError('test');

            /* eslint-enable */
            expect(
                RangeError.prototype.constructor.calls[0].args[0]
            ).to.eq(
                 bread('Cannot find test in module registry')
            );
        });
        it('test called without module', function() {

            /* eslint-disable */
            new $$ProviderNotFoundError();

            /* eslint-enable */
            expect(
                RangeError.prototype.constructor.calls[0].args[0]
            ).to.eq(
                 bread('Cannot find module in module registry')
            );
        });
    });
});

describe('$$ProviderDomainError', function() {
    beforeEach(function() {
        mock(ReferenceError.prototype, 'constructor', () => true);
    });
    afterEach(simple.restore);
    describe('constructor', function() {
        it('test constructor', function() {

            /* eslint-disable */
            new $$ProviderDomainError();

            /* eslint-enable */
            expect(
                ReferenceError.prototype.constructor.calls[0].args[0]
            ).to.eq(
                 bread('No dependencies to inject')
            );
        });
    });
});

describe('$$ProviderTypeError', function() {
    beforeEach(function() {
        mock(TypeError.prototype, 'constructor', () => true);
    });
    afterEach(simple.restore);
    describe('constructor', function() {
        it('test constructor', function() {

            /* eslint-disable */
            new $$ProviderTypeError();

            /* eslint-enable */
            expect(
                TypeError.prototype.constructor.calls[0].args[0]
            ).to.eq(
                 bread(
                     'Models cannot be called as arguments to directives. You ' +
                     'may manually inject these using `$Injector.get` if you so ' +
                     'choose'
                 )
            );
        });
    });
});