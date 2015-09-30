![emblem](https://rawgit.com/angie-framework/angie-injector/master/svg/angie.svg "emblem")

## Angie Injector

[![npm version](https://badge.fury.io/js/angie-injector.svg)](http://badge.fury.io/js/angie-injector)
![iojs support](https://img.shields.io/badge/iojs-1.7.1+-brightgreen.svg "iojs support")
![node support](https://img.shields.io/badge/node-0.12.0+-brightgreen.svg "node support")
![build status](https://travis-ci.org/benderTheCrime/angie-injector.svg?branch=master "build status")
![code coverage](https://rawgit.com/benderTheCrime/angie-injector/master/svg/coverage.svg "code coverage")
![npm downloads](https://img.shields.io/npm/dm/angie-injector.svg "npm downloads")
![documentation](https://doc.esdoc.org/github.com/angie-framework/angie-injector/badge.svg "documentation")

[![NPM](https://nodei.co/npm/angie-injector.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/angie-injector/)

## About
This is a very slim dependency injector for iojs/NodeJS ES6 projects. It will work standalone, or as an extension to the [Angie Framework](https://github.com/angie-injector/angie).

## Usage
```bash
npm i -g angie-injector
```
```javascript
import {default as Injector, $injectionBinder as binder} from 'angie-injector';
import {injector} from 'angie-injector/src/util/decorators';

// Specify from which object dependencies are injected
// Use raw injector, `global.app` by default.
Injector.$specifyInjectorRoot({
    test: 'test',
    test1: {}
});

// Fetch dependencies
Injector.get('test'); // 'test'
Injector.get('test', 'test1'); // [ 'test', {} ]

// Bind arguments to a function using the injector service
binder(function(test) {
    return test === 'test'; // true
});

// Slim decorator for instance methods
class Test {
    constructor() {
        this._test = this.test(); // Called with test
    }
    @injector
    test(test) {
        test === 'test'; // true
    }
}
```

For a list of Frequently Asked Questions, please see the [FAQ](https://github.com/angie-framework/angie-injector/blob/master/FAQ.md "FAQ") and the [CHANGELOG](https://github.com/angie-framework/angie-injector/blob/master/CHANGELOG.md "CHANGELOG") for an up to date list of changes. Contributors to this Project are outlined in the [CONTRIBUTORS](https://github.com/angie-framework/angie-injector/blob/master/CONTRIBUTORS.md "CONTRIBUTORS") file.

### Angie
Please see the [site](http://benderthecrime.github.io/angie/) for information about the project, a quickstart guide, and documentation and the [CHANGELOG](https://github.com/benderTheCrime/angie/blob/master/CHANGELOG.md) for an up to date list of changes.