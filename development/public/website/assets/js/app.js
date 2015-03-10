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
            ns.main = new ns.Main();
        };

        init();
    };

})(window.Caviar);