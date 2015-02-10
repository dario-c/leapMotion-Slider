var gulp = require("gulp");
var config = require("../gulpconfig");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var bsConfig = null;

gulp.task("livereload", function()
{
    "use strict";
    
    // Settings Browser sync
    bsConfig = {
        notify: false,
        proxy: config.host,
        host: config.host,
        port: 3000,
        ghostMode: {
            clicks: false,
            location: false,
            forms: false,
            scroll: false
        },
        logLevel: "info",
        open: false //"external" to open new browser window
    };

    // Start browser sync
    browserSync(bsConfig);
});