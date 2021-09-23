/*jshint esversion: 8 */

import gulp from 'gulp';
import browserSync from 'browser-sync';
import process from 'process';
import del from 'del';
import jest from 'gulp-jest';

//SASS

import gulpSass from "gulp-sass";
import dartSass from "sass";
const sass = gulpSass(dartSass);

const dest = 'public';

// BrowserSync Server

const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: dest
    }
  });
  done();
}

// Paths and tasks ...

const paths = {
  styles: {
    src: 'src/sass/**/*.scss',
    main: 'src/sass/main.scss',
    dest: `${dest}/styles/`
  },
  scripts: {
    src: 'src/**/*.js',
    dest: `${dest}`
  },
  html: {
    src: 'src/**/*.html',
    dest: `${dest}`
  },
  images: {
    src: 'src/images/**/*.{png,gif,jpg}',
    dest: `${dest}/images/`
  }

};

export const clean = async () => {
  del.sync([`${dest}/**`]);
};

export function html() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
}

export function images() {
  return gulp
    .src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

export function styles() {
  return gulp
    .src(paths.styles.main)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest));
}

export const test = () => {
  process.env.NODE_ENV = 'test';
  return gulp
    .src("tests/**/*test.js")
    .pipe(jest({
      "preprocessorIgnorePatterns": [
        "<rootDir>/dist/", "<rootDir>/node_modules/"
      ],
      "automock": false
    }));
};

export const build = (cb) => {
  clean();
  html();
  images();
  styles();
  scripts();
  cb();
};

const watch = () => {
  gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
  gulp.watch(paths.styles.src, gulp.series(styles, reload));
  gulp.watch(paths.html.src, gulp.series(html, reload));
  gulp.watch(paths.images.src, gulp.series(images, reload));
};

export const watchTests = () => {
  gulp.watch(["tests/**/*test.js"], test);
};

export const dev = gulp.series(build, serve, watch);
dev.description = 'Build app, start server, watch files, and use browsersync to update pages.';

export default dev;
