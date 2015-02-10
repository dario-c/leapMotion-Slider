var gulp = require("gulp");
var config = require("../gulpconfig");

gulp.task("css", function()
{
    "use strict";

    var fs = require("fs");
    var pkg = JSON.parse(fs.readFileSync(config.packageFile, "utf8"));

    return gulp.src(config.less_file)
        .pipe(config.$plugin.plumber({errorHandler: config.onError}))
        .pipe(config.$plugin.less() )
        .pipe(config.$plugin.autoprefixer(config.browserSupport))
        .pipe(gulp.dest(config.css_folder));
});