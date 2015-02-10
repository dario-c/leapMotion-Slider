// Create PROVIZ namespace
window.Caviar = window.Caviar || {};

(function(ns)
{
    "use strict";

    // Set global flags
    ns.DEBUG = false;
    ns.body = document.body;

    // Events that can get dispatched
    ns.eventNames = {
        RESIZE : "application:RESIZE"
    };
    
    // Set debug flag
    if(ns.DEBUG) ns.body.className += " debug";

})(window.Caviar);