var gulp = require("gulp");
var config = require("../gulpconfig");
var pngquant = require('imagemin-pngquant');

gulp.task("images", function()
{
    "use strict";
  
    gulp.src(config.images_folder + "**/*")
        .pipe(
            config.$plugin.imagemin(
                config.$plugin.cache({
                    optimizationLevel: 3,
                    progressive: true,
                    interlaced: true,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [pngquant()]
                })
            )
        )
        .pipe(gulp.dest("./optimized"))
        .pipe(config.$plugin.if(!config.production, config.$plugin.notify({message: "Images optimized"}) ));
});