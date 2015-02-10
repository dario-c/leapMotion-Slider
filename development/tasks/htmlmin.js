var gulp = require("gulp");
var config = require("../gulpconfig");

gulp.task("htmlmin", function()
{
    "use strict";
    
    var opts = { comments:true, spare:true, conditionals: true};
    var src_folder = config.pkg.cms ? config.build_tpl_folder + "/*.tpl" : config.build_folder + "/*.html";
    var dest_folder = config.pkg.cms ? config.build_tpl_folder : config.build_folder;

    return gulp.src(src_folder)
        .pipe(config.$plugin.minifyHtml(opts))
        .pipe(gulp.dest(dest_folder));
});