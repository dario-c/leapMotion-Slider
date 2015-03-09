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

    // Canvas Module
    ns.CanvasObj = ns.Canvas();
    var Canvas = ns.CanvasObj;

    // Leap Module
    ns.LeapObj = ns.LeapActions();
    var LeapActions = ns.LeapObj;

    // Slider Module
    ns.SliderObj = ns.Slider();
    var Slider = ns.SliderObj;

    // States Variables
    ns.transitioning = false;
    ns.zoomedOut = true;


    var init = function (){
      // Prepare Elements
      Slider.appendSlides();
      Canvas.resizeCanvas();
      Slider.findCenterPositionsOfAllSlides();

      ns.oneSlide = ns.$slideDivs.first();
      ns.slidesSize = Slider.findElementsSize(ns.oneSlide[0]);

      // Listen To Events
      LeapActions.controller.on("frame", LeapActions.processFrame);
      LeapActions.controller.connect();

      window.onresize = Slider.adaptValuesToScreenSize;

      ns.oneSlide.on("transitionend", Slider.endSliding);


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