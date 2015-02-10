var gulp = require("gulp");
var config = require("../gulpconfig");
var removeLogs = require('gulp-removelogs');

gulp.task("tpl-rev", function()
{
    "use strict";
    
    // This needs to be here to read the new bumped version number
    // by the version task that ran before this one
    var fs = require("fs");
    var pkg = JSON.parse(fs.readFileSync(config.packageFile, "utf8"));

    var src_folder = config.pkg.cms ? config.templates : config.html;
    var dest_folder = config.pkg.cms ? config.build_tpl_folder : config.build_folder;

    return gulp.src(src_folder)
        .pipe(config.$plugin.usemin({
            html: [
                // config.$plugin.minifyHtml({empty: true})
            ],
            css: [
                config.$plugin.if(config.production, config.$plugin.minifyCss() ),
                config.$plugin.if(config.production, config.$plugin.rename({ suffix: "-" + pkg.version + ".min"}) ),
                config.$plugin.rename(function(file) {
                    // console.log(file.dirname + "/" + file.basename + file.extname + " written");
                })
            ],
            js: [
                removeLogs(),
                config.$plugin.if(config.production, config.$plugin.uglify() ),
                config.$plugin.if(config.production, config.$plugin.rename({ suffix: "-" + pkg.version + ".min"}) ),
                config.$plugin.rename(function(file) {
                    // console.log(file.dirname + "/" + file.basename + file.extname + " written");
                })
            ]
        }))
       .pipe(gulp.dest(dest_folder));
});