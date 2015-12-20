![emblem](https://rawgit.com/angie-framework/angie-injector/master/svg/angie.svg "emblem")

## Angie Injector

[![npm version](https://badge.fury.io/js/angie-injector.svg)](http://badge.fury.io/js/angie-injector "npm version")
![iojs support](https://img.shields.io/badge/iojs-1.7.1+-brightgreen.svg "iojs support")
![node support](https://img.shields.io/badge/node-0.12.0+-brightgreen.svg "node support")
![npm downloads](https://img.shields.io/npm/dm/angie-injector.svg "npm downloads")
![build status](https://travis-ci.org/benderTheCrime/angie-injector.svg?branch=master "build status")
[![Coverage Status](https://coveralls.io/repos/benderTheCrime/angie-injector/badge.svg?branch=master&service=github)](https://coveralls.io/github/benderTheCrime/angie-injector?branch=master "coverage")
[![documentation](https://doc.esdoc.org/github.com/angie-framework/angie-injector/badge.svg)](https://doc.esdoc.org/github.com/angie-framework/angie-injector/ "documentation")

[![NPM](https://nodei.co/npm/angie-injector.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/angie-injector/)

## About
This is a very slim dependency injector for the Angie Framework. It will, based on the instantiated Angie application, inject functional dependencies into modules which have been registered via the exposed Angie application functions (including `Controller`, `directive` or `component` or `view`, `config`, and `factory`). The module itself can also be used via manual import to use the `$Injector` functionally. It also provides supported decorators for additional injection support.

## Usage
**Note**: as of version 1.0.0, this package can no longer be used standalone, it must be used as a byproduct of an [Angie](https://github.com/angie-framework/angie "Angie") application via the [Angie Framework](https://github.com/angie-framework "Angie Framework"). 0.10.x versions and below will continue to be supported for standalone use.

```bash
npm i -g angie-injector
```
```javascript
import $Injector, { $injectionBinder as binder } from 'angie-injector';
import { injector } from 'angie-injector/src/util/decorators';
import { Controller } from 'angie/src/util/decorators';

// Fetch dependencies
const test = $Injector.get('test');

// Fetch many dependencies, excusing for a moment that `test` cannot be redefined
const [ test, test1 ] = $Injector.get('test', 'test1');

// Bind arguments to a function using the injector service
binder(function(test) {
    return test === 'test';
});

// Slim decorator for instance methods
class Test {
    constructor() {
        this._test = this.test();
    }
    @injector
    test(test) {
        test === 'test'; // true
    }
}

// Or, on modules
@Controller
class Test {
    constructor(test) {
        test === 'test'; // true
    }
}
```

For a list of Frequently Asked Questions, please see the [FAQ](https://github.com/angie-framework/angie-injector/blob/master/md/FAQ.md "FAQ") and the [CHANGELOG](https://github.com/angie-framework/angie-injector/blob/master/md/CHANGELOG.md "CHANGELOG") for an up to date list of changes. Contributors to this Project are outlined in the [CONTRIBUTORS](https://github.com/angie-framework/angie-injector/blob/master/md/CONTRIBUTORS.md "CONTRIBUTORS") file.

## Documentation
Angie Injector documentation can be found [here](https://doc.esdoc.org/github.com/angie-framework/angie-injector/ "documentation").

### Angie
Please see the [site](http://benderthecrime.github.io/angie/) for information about the project, a quickstart guide, and documentation and the [CHANGELOG](https://github.com/angie-framework/angie/blob/master/md/CHANGELOG.md) for an up to date list of changes.