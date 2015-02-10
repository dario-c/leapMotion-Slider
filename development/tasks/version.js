var gulp = require("gulp");
var config = require("../gulpconfig");
var semver = require("semver");

gulp.task("version", function()
{
    "use strict";

    var type = (!config.production) ? "patch" : (config.deploy) ? "major" : "minor";
    var newVersion = semver.inc(config.pkg.version, type);

    /*
    * bump the package version
    */
    return gulp.src(config.packageFile)
        .pipe(config.$plugin.bump({ version: newVersion }))
        .pipe(gulp.dest("./"));
});