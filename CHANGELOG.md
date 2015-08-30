# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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
##### Removed/Added
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
##### Fixed/Added
- Fixed the $$registry flag for use with Angie MVC
- Added documentation around Exception classes

#### [0.9.1] - 2015-07-11
##### Fixed
- Fixed the way this package is required

## [0.9.0] - 2015-07-11
### Added
- Added ability to specify the object from which objects are injected

#### [0.0.1] - 2015-07-11
##### Added
- Modified project to be able to be imported
- Added many tests