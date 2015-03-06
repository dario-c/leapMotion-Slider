/**
*  App
*
*/
(function(ns)
{
    "use strict";

    /**
     * Desktop version of the application
     */
    ns.Application = function ()
    {

        var init = function ()
        {
            ns.slider = new ns.Slider();
            // ns.canvas = new ns.Canvas();
            // ns.leapActions = new ns.LeapActions();
        };

        init();
    };

})(window.Caviar);