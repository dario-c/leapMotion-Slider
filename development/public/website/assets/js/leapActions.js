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
  ns.LeapActions= function ()
  {
    var translationThreshold = 165;
    var lastSelectedIndexes = [];


    // CANVAS FUNCTIONS
    var Canvas = ns.CanvasObj;

    var controller = new Leap.Controller();



    var processFrame = function(frame){
      if(frame.hands.length > 0 && !ns.transitioning){
        var process = ns.zoomedOut ? processZoomedOutFrame : processZoomedInFrame;
        process(frame);
      }
    };

    var processZoomedOutFrame = function(frame){
      processPointingFinger(frame);
    };



    var processZoomedInFrame = function(frame){
      var hand = frame.hands[0];

      if(frame.hands.length >= 2){
        processTwoHands (hand, frame);
      }
      processMainHand(hand, frame);
    };


    var processTwoHands = function(hand, frame){
      var hand2 = frame.hands[1];
      var finger1Position = hand.pointables[1].stabilizedTipPosition;
      var finger2Position = hand2.pointables[1].stabilizedTipPosition;

      if(Math.abs(finger1Position[0] - finger2Position[0]) < 50 && Math.abs(finger1Position[1] - finger2Position[1]) < 10){
        ns.SliderObj.zoomOut();
      }
    };




    var processMainHand = function(hand, frame){
      var translation = hand.translation(controller.frame(10));
      var translationX = translation[0];
      var translationY = translation[1];

      var horizontal = Math.abs(translationX) > Math.abs(translationY) ? true : false;

      if(horizontal) {
        if(translationX < -translationThreshold) {
          ns.SliderObj.slide(ns.left);
        } else if (translationX > translationThreshold)  {
          ns.SliderObj.slide(ns.right);
        }
      } else {

        if(translationY < -translationThreshold) {
          ns.SliderObj.slide(ns.down);
        } else if (translationY > translationThreshold ) {
          ns.SliderObj.slide(ns.up);
        }
      }
    };

    var processPointingFinger = function(frame){
      var interactionBox = frame.interactionBox;
      var normalizedPosition = interactionBox.normalizePoint(frame.pointables[0].tipPosition, true);

      var tipPositionInWrapX = Math.round((ns.wrapAttr.width) * normalizedPosition[0]); // Number between 0 and the wrap-width
      var tipPositionInWrapY = Math.round((ns.wrapAttr.height) * (1 - normalizedPosition[1])); //  Number between 0 and the wrap-height

      var distancesToTip = {columns: [], rows: []};

      ns.SliderObj.findSlideDistanceToPosition(tipPositionInWrapX, tipPositionInWrapY, distancesToTip);
      ns.SliderObj.getIndexesOfClosestSlide(distancesToTip);

      // Check if there has been no change since last frame
      if(lastSelectedIndexes[0] === ns.selectedSlide.columnIndex && lastSelectedIndexes[1] === ns.selectedSlide.rowIndex){
        Canvas.calculateBorders(true);
        Canvas.animateBorder();
      } else {
        lastSelectedIndexes = [];
        lastSelectedIndexes.push(ns.selectedSlide.columnIndex, ns.selectedSlide.rowIndex);

        Canvas.setStartingBorderAttributes();
        Canvas.calculateBorders(false);

        ns.SliderObj.selectSlide();
      }
    };


    var init = function (){
     
    };
    
    init();

    return {
      processFrame: processFrame,
      controller: controller
    };
  };


})(window.Caviar);