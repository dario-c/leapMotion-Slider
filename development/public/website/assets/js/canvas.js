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

    var drawLine = function(start, finish){
      ns.ctx.beginPath();
      ns.ctx.moveTo(start[0], start[1]);
      ns.ctx.lineTo(finish[0], finish[1]);
      ns.ctx.lineWidth = ns.border.size;
      ns.ctx.strokeStyle = "white";
      ns.ctx.stroke();
    };

    var drawFullBorder = function(){
      ns.ctx.beginPath();
      ns.ctx.moveTo(ns.staticBorders.topLeftStart[0],     ns.staticBorders.topLeftStart[1]);
      ns.ctx.lineTo(ns.staticBorders.topRightStart[0],    ns.staticBorders.topRightStart[1]);
      ns.ctx.lineTo(ns.staticBorders.bottomRightStart[0], ns.staticBorders.bottomRightStart[1]);
      ns.ctx.lineTo(ns.staticBorders.bottomLeftStart[0],  ns.staticBorders.bottomLeftStart[1]);
      ns.ctx.lineTo(ns.staticBorders.topLeftStart[0],     ns.staticBorders.topLeftStart[1] - ns.halfBorder);

      ns.ctx.lineWidth = ns.border.size;
      ns.ctx.strokeStyle = "#BADA55";
      ns.ctx.stroke();
    };

    var clearCanvas = function(){
      ns.ctx.clearRect(0, 0, ns.canvas.width, ns.canvas.height);
    };


    var calculateBorders = function(animated){
      ns.slideCenterX = ns.columnsCenters[ns.selectedSlide.columnIndex];
      ns.slideCenterY = ns.rowsCenters[ns.selectedSlide.rowIndex];
      ns.halfBorder = ns.border.size / 2;
      ns.distanceToBorder = (ns.slidesSize[0] / 2) + ns.halfBorder;

      var findBorders = animated ? findCornersAnimatedBorder : findCornersStaticBorder;
      findBorders();
    };


    var findCornersAnimatedBorder = function(){
      ns.animatedBorders.topLeftStart = [     ns.slideCenterX - ns.distanceToBorder - ns.halfBorder, ns.slideCenterY - ns.distanceToBorder];
      ns.animatedBorders.topRightStart = [    ns.slideCenterX + ns.distanceToBorder,              ns.slideCenterY - ns.distanceToBorder - ns.halfBorder];
      ns.animatedBorders.bottomRightStart = [ ns.slideCenterX + ns.distanceToBorder + ns.halfBorder, ns.slideCenterY + ns.distanceToBorder];
      ns.animatedBorders.bottomLeftStart = [  ns.slideCenterX - ns.distanceToBorder,              ns.slideCenterY + ns.distanceToBorder + ns.halfBorder];

      ns.squareSide = ns.slidesSize[0] + (ns.border.size * 2);
    };

    var findCornersStaticBorder = function(){
      ns.staticBorders.topLeftStart = [     ns.slideCenterX - ns.distanceToBorder, ns.slideCenterY - ns.distanceToBorder];
      ns.staticBorders.topRightStart = [    ns.slideCenterX + ns.distanceToBorder, ns.slideCenterY - ns.distanceToBorder];
      ns.staticBorders.bottomRightStart = [ ns.slideCenterX + ns.distanceToBorder, ns.slideCenterY + ns.distanceToBorder];
      ns.staticBorders.bottomLeftStart = [  ns.slideCenterX - ns.distanceToBorder, ns.slideCenterY + ns.distanceToBorder];
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
          ns.border.toBottom = [ ns.slideCenterX + ns.distanceToBorder, ns.slideCenterY - ns.distanceToBorder - ns.halfBorder + ns.animatedBorders.rightLineLength ];
          drawLine(ns.animatedBorders.topRightStart, ns.border.toBottom);
          break;

        case (ns.animatedBorders.bottomLineLength + incrementThreshold) < ns.squareSide:
          ns.animatedBorders.bottomLineLength += increment;
          ns.border.toLeft = [ns.slideCenterX + ns.distanceToBorder + ns.halfBorder - ns.animatedBorders.bottomLineLength , ns.slideCenterY + ns.distanceToBorder ];
          drawLine(ns.animatedBorders.bottomRightStart, ns.border.toLeft);
          break;

        case (ns.animatedBorders.leftLineLength + incrementThreshold) < ns.squareSide:
          ns.animatedBorders.leftLineLength += increment;
          ns.border.toTop = [  ns.slideCenterX - ns.distanceToBorder, ns.slideCenterY + ns.distanceToBorder + ns.halfBorder - ns.animatedBorders.leftLineLength ];
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
      clearCanvas : clearCanvas,
      calculateBorders : calculateBorders,
      animateBorder : animateBorder
    };

  };
})(window.Caviar);