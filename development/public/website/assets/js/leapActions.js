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
    var Canvas = ns.Canvas();
    var drawLine = Canvas.drawLine;
    var drawFullBorder = Canvas.drawFullBorder;
    var clearCanvas = Canvas.clearCanvas;
    var calculateBorders = Canvas.calculateBorders;
    var animateBorder = Canvas.animateBorder;
    var resizeCanvas = Canvas.resizeCanvas;
    var setStartingBorderAttributes = Canvas.setStartingBorderAttributes;


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
        ns.zoomOut();
      }
    };




    var processMainHand = function(hand, frame){
      var translation = hand.translation(ns.controller.frame(10));
      var translationX = translation[0];
      var translationY = translation[1];

      var horizontal = Math.abs(translationX) > Math.abs(translationY) ? true : false;

      if(horizontal) {
        if(translationX < -translationThreshold) {
          ns.slide(ns.left);
        } else if (translationX > translationThreshold)  {
          ns.slide(ns.right);
        }
      } else {

        if(translationY < -translationThreshold) {
          ns.slide(ns.down);
        } else if (translationY > translationThreshold ) {
          ns.slide(ns.up);
        }
      }
    };

    var processPointingFinger = function(frame){
      var interactionBox = frame.interactionBox;
      var normalizedPosition = interactionBox.normalizePoint(frame.pointables[0].tipPosition, true);

      var tipPositionInWrapX = Math.round((ns.wrapAttr.width) * normalizedPosition[0]); // Number between 0 and the wrap-width
      var tipPositionInWrapY = Math.round((ns.wrapAttr.height) * (1 - normalizedPosition[1])); //  Number between 0 and the wrap-height

      var distancesToTip = {columns: [], rows: []};

      ns.findSlideDistanceToPosition(tipPositionInWrapX, tipPositionInWrapY, distancesToTip);
      ns.getIndexesOfClosestSlide(distancesToTip);

      // Check if there has been no change since last frame
      if(lastSelectedIndexes[0] === ns.selectedSlide.columnIndex && lastSelectedIndexes[1] === ns.selectedSlide.rowIndex){
        calculateBorders(true);
        animateBorder();
      } else {
        console.log("good");
        lastSelectedIndexes = [];
        lastSelectedIndexes.push(ns.selectedSlide.columnIndex, ns.selectedSlide.rowIndex);

        setStartingBorderAttributes();
        calculateBorders(false);

        ns.selectSlide();
      }
    };


    var init = function (){
     
    };
    
    init();

    return {
      processFrame: processFrame,
      processZoomedOutFrame: processZoomedOutFrame,
      processZoomedInFrame: processZoomedInFrame,
      processTwoHands: processTwoHands,
      processMainHand: processMainHand

    };
  };


})(window.Caviar);