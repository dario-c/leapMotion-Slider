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
    ns.squareSide = undefined;

    ns.animatedBorders = {};
    ns.selectedSlide = {};

    ns.zoomInOne = undefined;

    ns.wrap = $("#wrap")[0];
    ns.wrapAttr = ns.wrap.getBoundingClientRect();



    // Events that can get dispatched
    ns.eventNames = {
        RESIZE : "application:RESIZE"
    };
    
    // Set debug flag
    if(ns.DEBUG) ns.body.className += " debug";

})(window.Caviar);