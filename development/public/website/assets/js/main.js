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
    ns.Main = function ()
    {

      var oneSlide;



      // CANVAS FUNCTIONS
      ns.CanvasObj = ns.Canvas();
      var Canvas = ns.CanvasObj;

      // LEAP FUNCTIONS
      ns.LeapObj = ns.LeapActions();
      var LeapActions = ns.LeapObj;

      // SLIDER FUNCTIONS
      ns.SliderObj = ns.Slider();
      var Slider = ns.SliderObj;


      var init = function (){
        Slider.appendSlides();

        Canvas.resizeCanvas();
        Slider.findCenterPositionsOfAllSlides();

        LeapActions.controller.on("frame", LeapActions.processFrame);
        LeapActions.controller.connect();

        window.onresize = Slider.adaptValuesToScreenSize;

        oneSlide = ns.$slideDivs.first();
        ns.slidesSize = Slider.findElementsSize(oneSlide[0]);
        oneSlide.on("transitionend", Slider.endSliding);

        // Just for Debugging 
        if(ns.DEBUG){
          $(document).ready(function(){
            $(document.body).on("mouseover", function(e){
              var elem = document.elementFromPoint(e.pageX, e.pageY);
              
              ns.$slideDivs.removeClass("selected");
              $(elem).addClass("selected");
            });
          });

          $(ns.body).on("keydown", function(key){
            switch(key.keyCode){
              case 37:
                Slider.slide(ns.left);
                break;
              case 38:
                Slider.slide(ns.up);
                break;
              case 39:
                Slider.slide(ns.right);
                break;
              case 40:
                Slider.slide(ns.down);
                break;
              case 90:
                Slider.zoomOut();
                break;
              case 67:
                Slider.zoomInOne();
                break;
            }
          });
        }


      };
      init();
    };

})(window.Caviar);