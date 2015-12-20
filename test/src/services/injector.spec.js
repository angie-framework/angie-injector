// Test Modules
import { expect } from          'chai';

// Angie Injector Modules
const TEST_ENV = global.TEST_ENV || 'src';
const $InjectorProvider = require(`../../../${TEST_ENV}/services/injector`);
const $Injector = $InjectorProvider.default;
const $injectionBinder = $InjectorProvider.$injectionBinder;
const $$arguments = $InjectorProvider.$$arguments;

/* eslint-disable no-unused-expressions,require-jsdoc */
describe('$Injector', function() {
    const SET_REGISTRY = obj => global.app = obj;

    afterEach(() => {
        SET_REGISTRY();
    });
    describe('get', function() {
        let get = $Injector.get;

        beforeEach(function() {
            SET_REGISTRY({
                constants: {
                    test: 'test',
                    test1: 'test',
                    test3: 'test'
                },
                $$registry: {
                    test: 'constants',
                    test1: 'constants',
                    test3: 'constants',
                    test4: 'Models'
                }
            });
        });
        it('test get returns nothing if no arguments', function() {
            expect(get()).to.deep.eq([]);
        });
        it('test single, non-string first argument', function() {
            expect(get({})).to.deep.eq([]);
        });
        it('test single argument', function() {
            expect(get('test')).to.eq('test');
        });
        it('test single argument with argument underscores', function() {
            expect(get('_test_')).to.eq('test');
        });
        it('test single argument with argument double underscores', function() {
            expect(get('__test__')).to.eq('test');
        });
        it('test single argument with spaces', function() {
            expect(get(' te st ')).to.eq('test');
        });
        it('test argument not found', function() {
            expect(
                get.bind(null, 'test', 'test1', 'test2')
            ).to.throw(RangeError);
        });
        it('test all arguments found', function() {
            expect(
                get('test', 'test1', 'test3')
            ).to.deep.eq([ 'test', 'test', 'test' ]);
        });
        it('test directive requests Model injection', function() {
            expect(
                get.bind(null, [ 'test4' ], { type: 'directive' })
            ).to.throw(TypeError);
        });
        describe('test $scope', function() {
            beforeEach(function() {
                SET_REGISTRY({ $registry: {} });
            });
            it('test Controller requests $scope', function() {
                expect(
                    get([ '$scope' ], {
                        type: 'Controller', $scope: { val: 'test' }
                    })
                ).to.eq('test');
            });
            it('test directive requests $scope', function() {
                expect(
                    get([ '$scope' ], {
                        type: 'directive', $scope: { val: 'test' }
                    })
                ).to.eq('test');
            });
            it('test non-string scoping.type requests $scope', function() {
                expect(
                    get.bind(null, [ '$scope' ], {
                        type: {}, $scope: { val: 'test' }
                    })
                ).to.throw(RangeError);
            });
            it('test non-Controller/non-directive requests $scope', function() {
                expect(get.bind(null, [ '$scope' ], {})).to.throw(RangeError);
            });
        });
        describe('test $request/$response', function() {
            beforeEach(function() {
                SET_REGISTRY({ $registry: {} });
            });
            it('test Controller requests $request', function() {
                expect(
                    get([ '$request' ], {
                        type: 'Controller', $request: { val: 'test' }
                    })
                ).to.eq('test');
            });
            it('test controller requests $request', function() {
                expect(
                    get([ '$request' ], {
                        type: 'controller', $request: { val: 'test' }
                    })
                ).to.eq('test');
            });
            it('test Controller requests $response', function() {
                expect(
                    get([ '$response' ], {
                        type: 'Controller', $response: { val: 'test' }
                    })
                ).to.eq('test');
            });
            it('test controller requests $response', function() {
                expect(
                    get([ '$response' ], {
                        type: 'controller', $response: { val: 'test' }
                    })
                ).to.eq('test');
            });
            it('test non-Controller requests $request', function() {
                expect(get.bind(null, [ '$request' ], {})).to.throw(RangeError);
            });
            it('test non-Controller requests $repsonse', function() {
                expect(
                    get.bind(null, [ '$response' ], {})
                ).to.throw(RangeError);
            });
        });
    });
    describe('$injectionBinder', function() {
        let args,
            binder = $injectionBinder,
            fn = function() {
                args = arguments;
            };

        beforeEach(function() {
            SET_REGISTRY({
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
            SET_REGISTRY();
            args = undefined;
        });
        describe('test anonymous function', function() {
            let test = function() {},
                test1 = function(test) {
                    test = test;
                },
                test2 = function(test, test1) {
                    test = test1 = test1;
                };
            test.bind = test1.bind = test2.bind = fn;
            it('test empty args produces no returns', function() {
                binder(test);
                expect(args[ 0 ]).to.be.null;
                expect(args[ 1 ]).to.be.undefined;
            });
            it('test arguments with single provider', function() {
                binder(test1);
                expect(args[ 0 ]).to.be.null;
                expect(args[ 1 ]).to.eq('test');
            });
            it('test arguments with many providers', function() {
                binder(test2);
                expect(args[ 0 ]).to.be.null;
                expect(args[ 1 ]).to.eq('test');
                expect(args[ 2 ]).to.eq('test1');
            });
        });
        describe('test named function', function() {
            function test() {}
            function test1(test) {
                test = test;
            }
            function test2(test, test1) {
                test = test1 = test1;
            }
            test.bind = test1.bind = test2.bind = fn;
            it('test empty args produces no returns', function() {
                binder(test);
                expect(args[ 0 ]).to.be.null;
                expect(args[ 1 ]).to.be.undefined;
            });
            it('test arguments with single provider', function() {
                binder(test1);
                expect(args[ 0 ]).to.be.null;
                expect(args[ 1 ]).to.eq('test');
            });
            it('test arguments with many providers', function() {
                binder(test2);
                expect(args[ 0 ]).to.be.null;
                expect(args[ 1 ]).to.eq('test');
                expect(args[ 2 ]).to.eq('test1');
            });
        });
        describe('test arrow function', function() {
            let test = () => null,
                test1 = test => test = test,
                test2 = (test, test1) => test = test1 = test1;
            test.bind = test1.bind = test2.bind = fn;
            it('test empty args produces no returns', function() {
                binder(test);
                expect(args[ 0 ]).to.be.null;
                expect(args[ 1 ]).to.be.undefined;
            });
            it('test arguments with single provider', function() {
                binder(test1);
                expect(args[ 0 ]).to.be.null;
                expect(args[ 1 ]).to.eq('test');
            });
            it('test arguments with many providers', function() {
                binder(test2);
                expect(args[ 0 ]).to.be.null;
                expect(args[ 1 ]).to.eq('test');
                expect(args[ 2 ]).to.eq('test1');
            });
        });
    });
    describe('$$arguments', function() {
        describe('test anonymous function', function() {
            it('no arguments', function() {
                expect($$arguments(function() {})).to.deep.eq([]);
            });

            /* eslint-disable */
            it('one argument', function() {
                expect($$arguments(function(test) {})).to.deep.eq([ 'test' ]);
            });
            it('many arguments', function() {
                expect(
                    $$arguments(function(test, test1) {})
                ).to.deep.eq([ 'test', 'test1' ]);
            });

            /* eslint-enable */
        });
        describe('test named function', function() {
            it('no arguments', function() {
                expect($$arguments(function test() {})).to.deep.eq([]);
            });

            /* eslint-disable */
            it('one argument', function() {
                expect(
                    $$arguments(function test(test) {})
                ).to.deep.eq([ 'test' ]);
            });
            it('many arguments', function() {
                expect(
                    $$arguments(function test(test, test1) {})
                ).to.deep.eq([ 'test', 'test1' ]);
            });

            /* eslint-enable */
        });

        describe('test arrow function', function() {
            it('no arguments', function() {
                expect($$arguments(() => true)).to.deep.eq([]);
            });

            /* eslint-disable */
            it('one argument', function() {
                expect($$arguments(test => true)).to.deep.eq([ 'test' ]);
            });
            it('many arguments', function() {
                expect(
                    $$arguments((test, test1) => true)
                ).to.deep.eq([ 'test', 'test1' ]);
            });

            /* eslint-enable */
        });
    });
});
/* eslint-enable no-unused-expressions,require-jsdoc */