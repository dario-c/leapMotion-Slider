var gulp = require("gulp");
var config = require("../gulpconfig");
var browserSync = require("browser-sync");
var reload = browserSync.reload;

// Lint JavaScript
gulp.task("jshint", function()
{
    "use strict";

    return gulp.src(config.js_files)
        .pipe(reload({stream: true, once: true}))
        .pipe(config.$plugin.jshint(".jshintrc")) // Strict settings
        .pipe(config.$plugin.jshint.reporter("jshint-stylish"))
        // Show JS error when error occured
        // .pipe(config.$plugin.if( , config.$plugin.notify({message: "js error occured, validate js"}))
        // Only fail pipeline when production environment
        .pipe(config.$plugin.if(!config.production, config.$plugin.jshint.reporter("fail")));
});