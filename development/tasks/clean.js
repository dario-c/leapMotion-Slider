var gulp = require("gulp");
var config = require("../gulpconfig");
var rimraf = require("rimraf");

gulp.task("clean", function(errorCallback)
{
    "use strict";

    return rimraf(config.build_folder, errorCallback);
});