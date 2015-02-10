var gulp = require("gulp");
var config = require("../gulpconfig");
var filesToCopy = null;

// Create array from gulpconfig.js with the files we need to copy
if(config.full)
{
    // Copy both server-side and client-side files
    // Note: This would only be necessary the first time you deploy to a server.

    filesToCopy = config.files["server-side"];
    filesToCopy = filesToCopy.concat(config.files["client-side"].build);
}
else if (config.deploy)
{
    // Copy concattenated client-side files
    filesToCopy = config.files["client-side"].deploy;
}
else
{
    // Copy minified client-side files
    filesToCopy = config.files["client-side"].build;
}

gulp.task("copy", function()
{
    "use strict";

    // This needs to be here to read the new bumped version number
    // by the version task that ran before this one
    var fs = require("fs");
    var pkg = JSON.parse(fs.readFileSync(config.packageFile, "utf8"));

    return gulp.src(filesToCopy, { base: "./" })
        .pipe(config.$plugin.plumber({errorHandler: config.onError}))
        .pipe(config.$plugin.rename(function(path)
        {
            // -----------
            // FOR ASSET VERSIONING
            // -----------
            // // Test for images and --version-assets given in cmd
            // if(config.versionAssets && (/\.(gif|jpg|jpeg|tiff|png|svg)$/i).test(path.extname))
            // {
            //     // Add version number to files
            //     path.extname = path.extname.replace(".", "-" +pkg.version + ".");
            // }

            // remove public since we don"t need it
            
            if(path.dirname === "public"){
                path.dirname = path.dirname.replace("public", "");
            } else {
                path.dirname = path.dirname.replace("public/", "");
            }
        }))
        .pipe(gulp.dest(config.build_folder));
});