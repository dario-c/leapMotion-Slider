/* globals module:false, process:false */

    "use strict";

    var gulp = require("gulp");
    var browserSync = require("browser-sync");
    var reload = browserSync.reload;
    var config = require("./gulpconfig");
    var runSequence = require('run-sequence');

    // Store config for usage in /tasks files
    config.$plugin = require("gulp-load-plugins")();
    config.cmdArguments = require("yargs").argv;
    config.production = !!(config.cmdArguments.production);
    config.deploy = false;
    config.full = !!(config.cmdArguments.full);
    config.versionAssets = !!(config.cmdArguments["version-assets"]);

    // require all the tasks in the require-dir
    require("require-dir")("./tasks");

    /**
     * DEFAULT - WILL DO A WATCH ON YOUR PROJECT
     */
    gulp.task("default", function()
    {
        gulp.start("watch");
    });

    // Clean task.
    gulp.task("remove-build-folder", function()
    {
        gulp.start("clean");
    });
    //--------------------
    
    /**
     * WATCH FOR CHANGES
     */
    gulp.task("watch",  ["css", "inject"], function()
    {
        // Start livereload
        gulp.start("livereload");

        // Watch .less files
        gulp.watch(config.less_files, "", ["css", reload]);

        // Watch .js files
        gulp.watch(config.js_files, "", ["jshint", reload]);

        // Watch .tpl & .html files
        gulp.watch(config.templates, "", ["inject", reload]);
        gulp.watch(config.html, "", ["inject", reload]);
    });
    //--------------------

    /**
     * BUILD
     * @param {string} --production This will set the production flag to true and will minify css & js for example
     * @param {string} --full This will set the cms flag to true and copy all cms files for a Neutrino project
     */
    gulp.task("build", function()
    {
        runSequence("remove-build-folder", ["css", "jshint"], ["inject", "version", "tpl-rev", "copy"]);
    });
    //--------------------

    /**
     * DEPLOY
     */
    gulp.task("deploy", function()
    {
        // Force deploy settings
        config.production = true;
        config.full = true;
        config.deploy = true;

        runSequence("remove-build-folder", ["css", "jshint"], ["inject", "version", "tpl-rev", "copy"], "htmlmin");
    });
    //--------------------

    // Generate documentation from JS files
    gulp.task("doc", function()
    {
        // grunt.task.run("yuidoc");
    });
    //--------------------