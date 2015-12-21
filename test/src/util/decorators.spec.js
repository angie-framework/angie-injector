// Test Modules
import { expect } from          'chai';

// Angie Injector Modules
const TEST_ENV = global.TEST_ENV || 'src';
const inject = require(`../../../${TEST_ENV}/util/decorators`).inject;

describe('decorators', function() {
    describe('class-based injector decoration', function() {
        beforeEach(() => global.app = {
            constants: {
                test: 'test',
                test2: 'test',
                test3: 'test'
            },
            $$registry: {
                test: 'constants',
                test2: 'constants',
                test3: 'constants'
            }
        });
        afterEach(() => global.app = { $$registry: {} });
        it('test constructor has "test" provided', function() {
            @inject
            class Test {
                constructor(test) {
                    expect(test).to.eq('test');
                }
            }
            return new Test();
        });
        it('test instance method has "test" provided', function() {
            class Test {
                @inject
                test(test) {
                    expect(test).to.eq('test');
                }
            }

            return new Test().test();
        });
        it('test static method has "test" provided', function() {
            class Test {
                @inject
                static test(test2) {
                    expect(test2).to.eq('test');
                }
            }

            return Test.test();
        });
        it('test object literal method has "test" provided', function() {
            const Test = {
                @inject
                test(test3) {
                    expect(test3).to.eq('test');
                }
            };

            return Test.test();
        });
    });
});