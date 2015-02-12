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
        };

        init();
    };

})(window.Caviar);