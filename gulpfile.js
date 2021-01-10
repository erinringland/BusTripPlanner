const { src, dest, series } = require("gulp");
const csso = require("gulp-csso");
const concatCss = require("gulp-concat-css");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;

function htmlTask() {
  return src("src/*").pipe(dest("dist/"));
}

function stylesTask() {
  return src("src/css/*.css")
    .pipe(concatCss("style.css"))
    .pipe(sourcemaps.init())
    .pipe(csso())
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css/"));
}

function scriptTask() {
  return src("src/js/*.js")
    .pipe(concat("app.js"))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/js/"));
}

function iconTask() {
  return src("src/icon/*").pipe(dest("dist/icon/"));
}

exports.html = htmlTask;
exports.styles = stylesTask;
exports.script = scriptTask;
exports.icon = iconTask;

exports.default = series(htmlTask, stylesTask, scriptTask, iconTask);
