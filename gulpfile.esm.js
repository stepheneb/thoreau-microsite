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

const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: dest,
      index: "index.html"
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
    src: 'src/media/images/**/*.{png,gif,jpg}',
    dest: `${dest}/media/images/`
  },
  audio: {
    src: 'src/media/audio/**/*.mp3',
    dest: `${dest}/media/audio/`
  },
  video: {
    src: 'src/media/video/**/*.{mp4,webm}',
    dest: `${dest}/media/video/`
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

export function audio() {
  return gulp
    .src(paths.audio.src)
    .pipe(gulp.dest(paths.audio.dest));
}

export function video() {
  return gulp
    .src(paths.video.src)
    .pipe(gulp.dest(paths.video.dest));
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
  audio();
  video();
  styles();
  scripts();
  cb();
};

const watch = () => {
  gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
  gulp.watch(paths.styles.src, gulp.series(styles, reload));
  gulp.watch(paths.html.src, gulp.series(html, reload));
  gulp.watch(paths.images.src, gulp.series(images, reload));
  gulp.watch(paths.audio.src, gulp.series(audio, reload));
  gulp.watch(paths.video.src, gulp.series(video, reload));
};

export const watchTests = () => {
  gulp.watch(["tests/**/*test.js"], test);
};

export const dev = gulp.series(build, serve, watch);
dev.description = 'Build app, start server, watch files, and use browsersync to update pages.';

export default dev;
