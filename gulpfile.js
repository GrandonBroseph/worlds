const gulp         = require("gulp");
const pug          = require("gulp-pug");
const sass         = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const imagemin     = require("gulp-imagemin");
const cache        = require("gulp-cache");
const browserify   = require("gulp-browserify");
const connect      = require("gulp-connect");
const runSequence  = require("run-sequence");
const ngrok        = require("ngrok");
const del          = require("del");
const exec         = require("child_process").exec;
const config = {
          root:   ".",
          start:  "src",
          finish: "dist",
          static: true,
          port:   8080
      },
      start  = config.root + "/" + config.start,
      finish = config.root + "/" + config.finish;

gulp.task("pages", function() {
  return gulp.src(start+"/pages/index.pug")
             .pipe(pug())
             .pipe(gulp.dest(finish))
             .pipe(connect.reload());
});

gulp.task("styles", function() {
  return gulp.src(start+"/styles/*.+(scss|sass)")
             .pipe(sass()).on("error", sass.logError)
             .pipe(autoprefixer())
             .pipe(gulp.dest(finish+"/styles"))
             .pipe(connect.reload());
});

gulp.task("scripts", function() {
  return gulp.src(start+"/scripts/index.js")
             .pipe(browserify())
             .pipe(gulp.dest(finish+"/scripts"))
             .pipe(connect.reload());
});

gulp.task("images", function(){
    return gulp.src(start+"/images/**/*.+(png|jpg|gif|svg)")
               .pipe(cache(imagemin()))
               .pipe(gulp.dest(finish+"/images/"))
               .pipe(connect.reload());
});

gulp.task("clean", function() {
  return del(finish+"/**/*", {force: true});
});

gulp.task("build", ["clean"], function() {
  runSequence(["styles", "pages", "images", "scripts"]);
});

gulp.task("watch", ["build"], function() {
  gulp.watch(start+"/**/*.*", ["build"]);
});

gulp.task("server", function() {
  if (!config.static) {
    exec("node server", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
  } else {
    connect.server({
      root: finish,
      port: config.port,
      // livereload: true
    });
  }
});

gulp.task("tunnel", ["server"], function() {
  ngrok.connect(config.port, function (err, url) {
      if (err) {
          console.log(err);
          return;
      }
      console.log("Tunnel created at "+url+".");
  });
});

gulp.task("default", function() {
  runSequence("watch", "tunnel");
});
