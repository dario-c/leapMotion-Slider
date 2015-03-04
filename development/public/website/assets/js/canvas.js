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

  ns.Canvas = function ()
  {
    var increment = 7;
    var incrementThreshold = increment + Math.floor(increment / 2);

    var canvas = $(".feedback-canvas")[0];
    var ctx = canvas.getContext("2d");
    var staticBorders = {};
    var halfBorder;
    var distanceToBorder;
    var slideCenterX;
    var slideCenterY;


    var drawLine = function(start, finish){
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      ctx.lineTo(finish[0], finish[1]);
      ctx.lineWidth = ns.border.size;
      ctx.strokeStyle = "white";
      ctx.stroke();
    };

    var drawFullBorder = function(){
      ctx.beginPath();
      ctx.moveTo(staticBorders.topLeftStart[0],     staticBorders.topLeftStart[1]);
      ctx.lineTo(staticBorders.topRightStart[0],    staticBorders.topRightStart[1]);
      ctx.lineTo(staticBorders.bottomRightStart[0], staticBorders.bottomRightStart[1]);
      ctx.lineTo(staticBorders.bottomLeftStart[0],  staticBorders.bottomLeftStart[1]);
      ctx.lineTo(staticBorders.topLeftStart[0],     staticBorders.topLeftStart[1] - halfBorder);

      ctx.lineWidth = ns.border.size;
      ctx.strokeStyle = "#BADA55";
      ctx.stroke();
    };

    var clearCanvas = function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };


    var calculateBorders = function(animated){
      slideCenterX = ns.columnsCenters[ns.selectedSlide.columnIndex];
      slideCenterY = ns.rowsCenters[ns.selectedSlide.rowIndex];
      halfBorder = ns.border.size / 2;
      distanceToBorder = (ns.slidesSize[0] / 2) + halfBorder;

      var findBorders = animated ? findCornersAnimatedBorder : findCornersStaticBorder;
      findBorders();
    };

    var resizeCanvas = function(){
      ns.wrapAttr = ns.wrap.getBoundingClientRect();
      canvas.width = ns.wrapAttr.width;
      canvas.height = ns.wrapAttr.height;
    };

    var findCornersAnimatedBorder = function(){
      ns.animatedBorders.topLeftStart = [     slideCenterX - distanceToBorder - halfBorder, slideCenterY - distanceToBorder];
      ns.animatedBorders.topRightStart = [    slideCenterX + distanceToBorder,              slideCenterY - distanceToBorder - halfBorder];
      ns.animatedBorders.bottomRightStart = [ slideCenterX + distanceToBorder + halfBorder, slideCenterY + distanceToBorder];
      ns.animatedBorders.bottomLeftStart = [  slideCenterX - distanceToBorder,              slideCenterY + distanceToBorder + halfBorder];

      ns.squareSide = ns.slidesSize[0] + (ns.border.size * 2);
    };

    var findCornersStaticBorder = function(){
      staticBorders.topLeftStart = [     slideCenterX - distanceToBorder, slideCenterY - distanceToBorder];
      staticBorders.topRightStart = [    slideCenterX + distanceToBorder, slideCenterY - distanceToBorder];
      staticBorders.bottomRightStart = [ slideCenterX + distanceToBorder, slideCenterY + distanceToBorder];
      staticBorders.bottomLeftStart = [  slideCenterX - distanceToBorder, slideCenterY + distanceToBorder];
    };

    var setStartingBorderAttributes = function(){
      clearCanvas();
      ns.border = {};
      ns.border.size = 13;
      ns.animatedBorders.leftLineLength = ns.animatedBorders.rightLineLength = ns.animatedBorders.bottomLineLength = 0;
      ns.animatedBorders.topLineLength = -250;
    };


    var animateBorder = function(){
      switch(true){
        // Increase line length until it has reach the size of a square side
        case (ns.animatedBorders.topLineLength + incrementThreshold) < ns.squareSide:
          ns.animatedBorders.topLineLength += increment;

          if(ns.animatedBorders.topLineLength >= 0){ // Ignore the offset given to delay animation
            ns.border.toRight = [ns.animatedBorders.topLeftStart[0] + ns.animatedBorders.topLineLength, ns.animatedBorders.topLeftStart[1]];
            drawLine(ns.animatedBorders.topLeftStart, ns.border.toRight);
          }
          break;

        case (ns.animatedBorders.rightLineLength + incrementThreshold) < ns.squareSide:
          ns.animatedBorders.rightLineLength += increment;
          ns.border.toBottom = [ slideCenterX + distanceToBorder, slideCenterY - distanceToBorder - halfBorder + ns.animatedBorders.rightLineLength ];
          drawLine(ns.animatedBorders.topRightStart, ns.border.toBottom);
          break;

        case (ns.animatedBorders.bottomLineLength + incrementThreshold) < ns.squareSide:
          ns.animatedBorders.bottomLineLength += increment;
          ns.border.toLeft = [slideCenterX + distanceToBorder + halfBorder - ns.animatedBorders.bottomLineLength , slideCenterY + distanceToBorder ];
          drawLine(ns.animatedBorders.bottomRightStart, ns.border.toLeft);
          break;

        case (ns.animatedBorders.leftLineLength + incrementThreshold) < ns.squareSide:
          ns.animatedBorders.leftLineLength += increment;
          ns.border.toTop = [  slideCenterX - distanceToBorder, slideCenterY + distanceToBorder + halfBorder - ns.animatedBorders.leftLineLength ];
          drawLine(ns.animatedBorders.bottomLeftStart, ns.border.toTop);
          break;
        default:
          ns.zoomInOne();
          break;
      }
    };


    var init = function (){
    };

    init();

    return {
      drawFullBorder: drawFullBorder,
      drawLine: drawLine,
      clearCanvas: clearCanvas,
      calculateBorders: calculateBorders,
      animateBorder: animateBorder,
      resizeCanvas: resizeCanvas,
      setStartingBorderAttributes: setStartingBorderAttributes
    };

  };
})(window.Caviar);