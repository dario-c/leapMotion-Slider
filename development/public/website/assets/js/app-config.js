window.Caviar = window.Caviar || {};

(function(ns)
{
    "use strict";

    // Set global flags
    ns.DEBUG = true;
    ns.body = document.body;

    ns.border = {};

    ns.columnsCenters = undefined;
    ns.rowsCenters = undefined;
    ns.slideSize = undefined;

    ns.selectedSlide = {};


    ns.wrap = $("#wrap")[0];
    ns.wrapAttr = ns.wrap.getBoundingClientRect();

    ns.transitioning = false;
    ns.zoomedOut = true;

    // ns.zoomInOne = undefined;
    // ns.processZoomedOutFrame = undefined;
    // ns.processZoomedInFrame = undefined;
    // ns.slide = undefined;
    // ns.findSlideDistanceToPosition = undefined;
    // ns.getIndexesOfClosestSlide = undefined;

    ns.controller = new Leap.Controller();
    
    ns.staticBorders = {};
    ns.halfBorder = undefined;


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