window.Caviar = window.Caviar || {};

(function(ns)
{
    "use strict";

    // Set global flags
    ns.DEBUG = true;
    ns.body = document.body;

    // Shared By Slider and Canvas
    ns.columnsCenters = undefined;
    ns.rowsCenters = undefined;
    ns.slideSize = undefined;

    // Shared By Slider and Leap
    ns.transitioning = false;
    ns.zoomedOut = true;

    // Shared by all
    ns.selectedSlide = {};
    ns.wrap = $("#wrap")[0];
    ns.wrapAttr = ns.wrap.getBoundingClientRect();

    ns.left = "left";
    ns.right = "right";
    ns.up = "up";
    ns.down = "down";

    // Events that can get dispatched
    ns.eventNames = {
        RESIZE : "application:RESIZE"
    };
    
    // Set debug flag
    if(ns.DEBUG) ns.body.className += " debug";

})(window.Caviar);