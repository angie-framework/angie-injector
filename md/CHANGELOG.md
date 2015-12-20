# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.0] - 2015-11-01
### Added/Changed
- Made the package specific to Angie Framework applications
- Updated the structure of the injector `$Exceptions` utilities
- Added tests for supported decorators and missing type support

#### [0.10.3] - 2015-10-19
##### Fixed
- Fixed an issue preventing multiple trailing and leading underscores from being removed from the injected provider name
- Added WallabyJS configuration

#### [0.10.2] - 2015-09-29
##### Changed
- Modified README

#### [0.10.1] - 2015-09-29
##### Changed
- Modified README

### [0.10.0] - 2015-09-17
#### Added/Changed
- Modified file and export names
- Modified the way in which arguments are broken out of functions. This functionality has been moved to a new private method.
- Improved exception messaging, moved exception classes out to an exclusive file
- Added tests around transpiled distribution files

#### [0.9.14] - 2015-09-07
##### Changed
- Change the structure and content of the $Injector invoked exceptions:
    - $$ProviderNotFoundError
    - $$ProviderDomainError
    - $$ProviderTypeError

#### [0.9.13] - 2015-08-30
##### Fixed
- Removed npm prepublish script
- Modified npm postinstall script to use babel from the cli
- Moved some npm dependencies to devDependencies

#### [0.9.12] - 2015-08-30
##### Added
- Re-added removed npm scripts.

#### [0.9.11] - 2015-08-30
##### Fixed
- Fixed issues with the npm postinstall script not actually addressed by 0.9.10.

#### [0.9.10] - 2015-08-29
##### Fixed
- Fixed an issue preventing the proper postinstall script from executing on the package

#### [0.9.9] - 2015-08-27
##### Fixed
- Fixed removal of trailing/leading underscores in provider names

#### [0.9.8] - 2015-08-27
##### Added
- Added `CHANGELOG.md` check to gulp `bump` task.

#### [0.9.7] - 2015-08-25
##### Changed/Removed
- Removed documentation and distribution files
- Changed the postinstall and prepublish npm scripts

#### [0.9.6] - 2015-08-23
##### Added/Removed
- Removed documentation from `.gitignore`
- Removed unnecessary `use strict;` lines from many files.
- Created a `dist` folder/runtime with an equivalent pre-compiled Angie Log framework.

#### [0.9.5] - 2015-07-30
##### Fixed
- Added a decorator for ease of use injections into instance methods

#### [0.9.4] - 2015-07-28
##### Fixed
- Fixed coverage report

#### [0.9.3] - 2015-07-16
##### Fixed
- Fixed coverage report

#### [0.9.2] - 2015-07-16
##### Added/Fixed
- Fixed the $$registry flag for use with Angie MVC
- Added documentation around Exception classes

#### [0.9.1] - 2015-07-11
##### Fixed
- Fixed the way this package is required

### [0.9.0] - 2015-07-11
#### Added
- Added ability to specify the object from which objects are injected

#### [0.0.1] - 2015-07-11
##### Added
- Modified project to be able to be imported
- Added many tests