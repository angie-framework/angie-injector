// System Modules
import fs from                  'fs';
import gulp from                'gulp';
import {argv} from              'yargs';
import eslint from              'gulp-eslint';
import jscs from                'gulp-jscs';
import istanbul from            'gulp-istanbul';
import {Instrumenter} from      'isparta';
import mocha from               'gulp-mocha';
import cobertura from           'istanbul-cobertura-badger';
import esdoc from               'gulp-esdoc';
import babel from               'gulp-babel';
import {bold, red} from         'chalk';

const bread = (str) => bold(red(str));

const SRC_DIR = './src',
    SRC = `${SRC_DIR}/**/*.js`,
    TRANSPILED_SRC_DIR = './dist',
    TRANSPILED_SRC = `${TRANSPILED_SRC_DIR}/**/*.js`,
    TEST_SRC = './test/src/**/*.spec.js',
    TRANSPILED_TEST_SRC = './test/dist/**/*.spec.js',
    DOC_SRC = './doc',
    COVERAGE_SRC = './coverage';

gulp.task('eslint', function () {
    gulp.src([ SRC, TEST_SRC ]).pipe(
        eslint()
    ).pipe(
        eslint.format()
    ).pipe(
        eslint.failOnError()
    );
});
gulp.task('jscs', [ 'eslint' ], function () {
    return gulp.src([ SRC, TEST_SRC ])
        .pipe(jscs({
            fix: true,
            configPath: '.jscsrc',
            esnext: true
        }));
});
gulp.task('istanbul:src', [ 'jscs' ], istanbulHandler.bind(null, SRC));
gulp.task('istanbul:dist', istanbulHandler.bind(null, TRANSPILED_SRC));
gulp.task('mocha:src', [ 'istanbul:src' ], function() {
    return gulp.src(TEST_SRC).pipe(mocha({
        reporter: 'spec'
    })).pipe(istanbul.writeReports({
        dir: 'coverage',
        reportOpts: {
            dir: 'coverage'
        },
        reporters: [ 'text', 'text-summary', 'html', 'cobertura' ]
    }));
});
gulp.task(
    'mocha:src',
    [ 'istanbul:src' ],
    mochaHandler.bind(null, TEST_SRC, COVERAGE_SRC)
);
gulp.task(
    'mocha:dist',
    [ 'istanbul:dist' ],
    mochaHandler.bind(null, TRANSPILED_TEST_SRC, undefined)
);
gulp.task('cobertura:src', [ 'mocha:src' ], function(cb) {
    cobertura('coverage/cobertura-coverage.xml', 'svg', cb);
});
gulp.task('babel', function() {
    return gulp.src(SRC).pipe(babel({
        comments: false
    })).pipe(gulp.dest(TRANSPILED_SRC_DIR));
});
gulp.task('esdoc', function() {
    return gulp.src(SRC_DIR).pipe(esdoc({ destination: DOC_SRC }));
});
gulp.task('bump', function() {
    const version = argv.version,
        bump = (f) => fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(
            /[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/,
            version
        ));
    if (version) {

        // Verify that the version is in the CHANGELOG
        if (fs.readFileSync('CHANGELOG.md', 'utf8').indexOf(version) === -1) {
            throw new Error(bread('Version has no entry in CHANGELOG.md'));
        }

        bump('bin/angie-injector');
        bump('bin/angie-injector-dist');
        bump('package.json');
    } else {
        throw new Error(bold(red('No version specified!!')));
    }
});
gulp.task('watch', [ 'jscs', 'mocha:src' ], function() {
    gulp.watch([ SRC, TEST_SRC ], [ 'mocha:src' ]);
});
gulp.task('watch:babel', [ 'babel' ], function() {
    gulp.watch([ 'src/**' ], [ 'babel' ]);
});
gulp.task('test:src', [ 'jscs', 'mocha:src' ]);
gulp.task('test:dist', [ 'mocha:dist' ]);
gulp.task('test', [ 'test:src', 'test:dist' ]);
gulp.task('default', [ 'jscs', 'mocha:src', 'babel', 'esdoc' ]);

function istanbulHandler(src, cb) {
    gulp.src(src).pipe(istanbul({
        instrumenter: Instrumenter,
        includeUntested: true,
        babel: {
            stage: 0
        }
    })).pipe(istanbul.hookRequire()).on('finish', cb);
}

function mochaHandler(src, coverage = '/tmp') {
    return gulp.src(src).pipe(mocha({
        reporter: 'spec'
    })).pipe(istanbul.writeReports({
        dir: coverage,
        reportOpts: {
            dir: coverage
        },
        reporters: [ 'text', 'text-summary', 'html', 'cobertura' ]
    }));
}
