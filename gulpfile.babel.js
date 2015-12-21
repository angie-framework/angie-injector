import { default as register } from     'babel-core/register';
register({
    only: [
        '**/node_modules/angie*/**',
        '**/{src,test}/**'
    ],
    stage: 0
});

// System Modules
import fs from                          'fs';
import gulp from                        'gulp';
import { argv } from                    'yargs';
import eslint from                      'gulp-eslint';
import istanbul from                    'gulp-istanbul';
import { Instrumenter } from            'isparta';
import mocha from                       'gulp-mocha';
import esdoc from                       'gulp-esdoc';
import babel from                       'gulp-babel';
import { bold, red } from               'chalk';

const SRC_DIR = './src',
    SRC = `${SRC_DIR}/**/*.js`,
    TRANSPILED_SRC_DIR = './dist',
    TRANSPILED_SRC = `${TRANSPILED_SRC_DIR}/**/*.js`,
    TEST_SRC = './test/src/**/*!(decorators).spec.js',
    TRANSPILED_TEST_SRC = './test/dist/**/*.spec.js',
    DOC_SRC = './doc',
    COVERAGE_SRC = './coverage';

gulp.task('eslint', function () {
    return gulp.src([ SRC, TEST_SRC ]).pipe(eslint({
        useEslintrc: true
    })).pipe(eslint.format()).pipe(eslint.failAfterError());
});
gulp.task('istanbul:src', [ 'eslint' ], istanbulHandler.bind(null, SRC));
gulp.task('istanbul:dist', [ 'babel' ], istanbulHandler.bind(null, TRANSPILED_SRC));
gulp.task(
    'mocha:src',
    [ 'istanbul:src' ],
    mochaHandler.bind(null, 'src', COVERAGE_SRC)
);
gulp.task(
    'mocha:dist',
    [ 'istanbul:dist' ],
    mochaHandler.bind(null, 'dist', undefined)
);
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
        if (fs.readFileSync('md/CHANGELOG.md', 'utf8').indexOf(version) === -1) {
            throw new Error(bread('Version has no entry in CHANGELOG.md'));
        }

        bump('bin/angie-injector');
        bump('bin/angie-injector-dist');
        bump('package.json');
    } else {
        throw new Error(bold(red('No version specified!!')));
    }
});
gulp.task('watch', [ 'eslint', 'mocha:src' ], function() {
    gulp.watch([ SRC, TEST_SRC ], [ 'mocha:src' ]);
});
gulp.task('watch:babel', [ 'babel' ], function() {
    gulp.watch(SRC, [ 'babel' ]);
});
gulp.task('test:src', [ 'eslint', 'mocha:src' ]);
gulp.task('test:dist', [ 'mocha:dist' ]);
gulp.task('test', [ 'test:src' ]);
gulp.task('default', [ 'test:src', 'babel', 'esdoc' ]);

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
    global.TEST_ENV = src;
    return gulp.src(TEST_SRC).pipe(mocha({
        reporter: 'spec'
    })).pipe(istanbul.writeReports({
        dir: coverage,
        reportOpts: {
            dir: coverage
        },
        reporters: [ 'text', 'text-summary', 'lcov' ]
    }));
}