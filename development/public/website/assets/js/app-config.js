window.Caviar = window.Caviar || {};

(function(ns)
{
    "use strict";

    // Set global flags
    ns.DEBUG = true;
    ns.body = document.body;

    ns.canvas = $(".feedback-canvas")[0];
    ns.ctx = ns.canvas.getContext("2d");
    ns.border = {};
    ns.staticBorders = {};
    ns.halfBorder = undefined;

    ns.slideCenterX = undefined;
    ns.slideCenterY = undefined;
    ns.columnsCenters = undefined;
    ns.rowsCenters = undefined;
    ns.slideSize = undefined;
    ns.distanceToBorder = undefined;
    ns.squareSide = undefined;

    ns.animatedBorders = {};
    ns.selectedSlide = {};

    ns.zoomInOne = undefined;

    // Events that can get dispatched
    ns.eventNames = {
        RESIZE : "application:RESIZE"
    };
    
    // Set debug flag
    if(ns.DEBUG) ns.body.className += " debug";

})(window.Caviar);