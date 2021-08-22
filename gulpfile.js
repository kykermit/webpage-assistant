// Config
const pathConfig = {
    input: {
        root: 'src',
        scss: 'src/scss',
        ejs: 'src/ejs',
        ts: 'src/ts',
    },
    output: {
        root: 'dist',
        scss: 'dist/style',
        ejs: 'dist',
        ts: 'dist/script',
    },
};

const options = require('minimist')(process.argv.slice(2));

// Gulp utility
const gulp = require('gulp');
const gPlumber = require('gulp-plumber');
const gRename = require('gulp-rename');

// Browser reload
const browserSync = require('browser-sync').create();

const rimraf = require('rimraf');

// EJS
const gFrontMatter = require('gulp-front-matter');
const wrapper = require('layout-wrapper');

// Sass
const gDartSass = require('gulp-dart-sass');

// PostCSS
const gPostcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssSortMediaQueries = require('postcss-sort-media-queries');
const cssDeclarationSorter = require('css-declaration-sorter');
const cssnano = require('cssnano');

// PostCSS Settings
const postcssPlugin = [
    postcssSortMediaQueries(),
    autoprefixer(),
    cssDeclarationSorter({
        order: 'alphabetical',
    }),
    cssnano(),
];

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');

webpackConfig.mode = options.production ? 'production' : 'development';

const ejs = () => {
    return gulp
        .src(`${pathConfig.input.ejs}/content/**/*.ejs`)
        .pipe(gPlumber())
        .pipe(gFrontMatter())
        .pipe(wrapper({
            layout: `${pathConfig.input.ejs}/layout`,
            engine: 'ejs',
        }))
        .pipe(gRename({
            extname: '.html',
        }))
        .pipe(gulp.dest(pathConfig.output.ejs));
};

const scss = () => {
    return gulp
        .src(`${pathConfig.input.scss}/**/*.scss`)
        .pipe(gPlumber())
        .pipe(gDartSass().on('error', gDartSass.logError))
        .pipe(gPostcss(postcssPlugin))
        .pipe(gulp.dest(pathConfig.output.scss))
        .pipe(browserSync.stream());
};

const ts = () => {
    return webpackStream(webpackConfig, webpack)
        .pipe(gPlumber())
        .pipe(gulp.dest(`${pathConfig.output.ts}`))
        .pipe(browserSync.stream());
};

const serve = (done) => {
    browserSync.init({
        server: pathConfig.output.root,
        open: 'external',
        notify: false,
    });

    gulp.watch([`${pathConfig.output.root}/**/*.html`]).on('change', browserSync.reload);

    done();
};

const watch = () => {
    gulp.watch([`${pathConfig.input.ejs}/**/*.ejs`], gulp.parallel(ejs));
    gulp.watch([`${pathConfig.input.scss}/**/*.scss`], gulp.parallel(scss));
    gulp.watch([`${pathConfig.input.ts}/**/*.ts`], gulp.parallel(ts));
};

const clean = (cb) => {
    rimraf(`${pathConfig.output.root}/**`, cb);
};

const copy = () => {
    return gulp
        .src([
            'public/**',
            '!public/_**/**',
        ], {
            base: 'public',
        })
        .pipe(gulp.dest(pathConfig.output.root));
};

const build = (done) => {
    return gulp.series(clean, copy, ejs, scss, ts)(done);
};

const start = (done) => {
    return gulp.series(ejs, scss, ts, serve, watch)(done);
};

exports.default = start;
exports.build = build;
exports.ejs = ejs;
exports.scss = scss;
exports.ts = ts;
