// Put these tags in the HTML or TPL:
// 
// <!-- inject:js -->
// <!-- endinject -->

var gulp = require("gulp");
var config = require("../gulpconfig");
var mainBowerFiles = require("main-bower-files");

gulp.task("inject", function ()
{
    "use strict";

    var src_folder = config.pkg.cms ? config.templates : config.html;
    var dest_folder = config.pkg.cms ? config.tpl_folder : config.html_folder;

    var cssFiles = gulp.src(config.css_files, {read: false});
    var jsFiles = gulp.src(config.js_files, {read: false});
    var bowerFiles = mainBowerFiles({checkExistence : true, path : "/website"});
    var headFiles = config.js_folder + "/**/head.*.js";

    return gulp.src(src_folder)
        .pipe(config.$plugin.inject(gulp.src(headFiles, { base: "./", read : false }), {name: "head", relative: true}))
        .pipe(config.$plugin.inject(gulp.src(bowerFiles, { base: "./", read : false }), {name: "bower", relative: true}))
        .pipe(config.$plugin.inject(cssFiles, {relative: true}))
        .pipe(config.$plugin.inject(jsFiles, {relative: true}))

        .pipe(gulp.dest(dest_folder));
});