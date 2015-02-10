/* globals module:false, process:false */

"use strict";

var plugins = require("gulp-load-plugins")();
var packageFile = "./package.json";
var pkg = require(packageFile);

module.exports =
{
    pkg: pkg,
    packageFile : packageFile,
    host: "raw-diamonds.dev",
    browserSupport: [
        "ie >= 9",
        "ie_mob >= 10",
        "ff >= 30",
        "chrome >= 34",
        "safari >= 7",
        "opera >= 23",
        "ios >= 7",
        "android >= 4.4",
        "bb >= 10"
    ],

    /*
    Folders
     */
    app_folder: "./public/website",
    css_folder: "./public/website/assets/css",
    js_folder: "./public/website/assets/js",
    images_folder: "./public/website/assets/images",
    tpl_folder: "./public/website/templates",
    html_folder: "./public",

    /*
    Files
     */
    image_files: [
        "./public/website/assets/images/**/*"
    ],
    less_file: [
        "./public/website/assets/less/*.+(less)"
    ],

    /*
    Watch files
     */
    js_files: [
        "./public/website/assets/js/**/*.js",
        "!./public/website/assets/js/**/*.min.js",
        "!./public/website/assets/js/lib/**/*.js"
    ],
    css_files: [
        "./public/website/assets/css/**/*.css"
    ],
    less_files: [
        "./public/website/assets/less/**/*.less"
    ],
    templates: [
        "./public/website/templates/**/*.tpl"
    ],
    html: [
        "./public/**/*.html"
    ],

    /*
    * Build structure
    */
    build_folder: "../deploy",
    build_tpl_folder: "../deploy/website/templates",
    build_css_folder: "../deploy/website/assets/css",
    build_js_folder: "../deploy/website/assets/js",
    
    /*
    * prevent watch from crashing:
    * http://cameronspear.com/blog/how-to-handle-gulp-watch-errors-with-plumber/
    * 
    * placed in config so we can reuse it across task modules
    */
    onError: function (error)
    {
        plugins.util.beep();
        console.dir(error);
    },

    // Files to copy
    files : {
        "server-side" : [
            // CMS Files
            "public/.htaccess",
            "public/caching/**/*",
            "public/cms/**/*",
            "public/config/*",
            "public/core/**/*",
            "public/index.php",
            "public/simple_text/**/*",
            // Nodejs
            "public/server/**/*",
            // Config
            "public/website/config/**/*",
            "public/website/lib/**/*"
        ],
        "client-side" : {
            "build" : [
                // Frontend
                "public/website/assets/images/**/*",
                "public/website/assets/fonts/**/*",
                "public/website/assets/video/**/*",
                "public/website/assets/audio/**/*"
            ],
            "deploy" : [
                // Frontend
                "public/website/assets/images/**/*",
                "public/website/assets/fonts/**/*",
                "public/website/assets/video/**/*",
                "public/website/assets/audio/**/*"
            ]
        }
    }
};
