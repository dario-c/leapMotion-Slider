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


    var animatedBorders = {};
    var staticBorders = {};
    var border = {};
    var halfBorder;
    
    var distanceToBorder;
    
    var slideCenterX;
    var slideCenterY;
    
    var squareSide;


    var setStartingBorderAttributes = function(){
      clearCanvas();
      border = {};
      border.size = 13;
      animatedBorders.leftLineLength = animatedBorders.rightLineLength = animatedBorders.bottomLineLength = 0;
      animatedBorders.topLineLength = -250;
    };

    var resizeCanvas = function(){
      ns.wrapAttr = ns.wrap.getBoundingClientRect();
      canvas.width = ns.wrapAttr.width;
      canvas.height = ns.wrapAttr.height;
    };

    var clearCanvas = function(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    var calculateBorders = function(animated){
      slideCenterX = ns.columnsCenters[ns.selectedSlide.columnIndex];
      slideCenterY = ns.rowsCenters[ns.selectedSlide.rowIndex];
      halfBorder = border.size / 2;
      distanceToBorder = (ns.slidesSize[0] / 2) + halfBorder;

      var findBorders = animated ? findCornersAnimatedBorder : findCornersStaticBorder;
      findBorders();
    };

    var findCornersAnimatedBorder = function(){
      animatedBorders.topLeftStart = [     slideCenterX - distanceToBorder - halfBorder, slideCenterY - distanceToBorder];
      animatedBorders.topRightStart = [    slideCenterX + distanceToBorder,              slideCenterY - distanceToBorder - halfBorder];
      animatedBorders.bottomRightStart = [ slideCenterX + distanceToBorder + halfBorder, slideCenterY + distanceToBorder];
      animatedBorders.bottomLeftStart = [  slideCenterX - distanceToBorder,              slideCenterY + distanceToBorder + halfBorder];

      squareSide = ns.slidesSize[0] + (border.size * 2);
    };

    var findCornersStaticBorder = function(){
      staticBorders.topLeftStart = [     slideCenterX - distanceToBorder, slideCenterY - distanceToBorder];
      staticBorders.topRightStart = [    slideCenterX + distanceToBorder, slideCenterY - distanceToBorder];
      staticBorders.bottomRightStart = [ slideCenterX + distanceToBorder, slideCenterY + distanceToBorder];
      staticBorders.bottomLeftStart = [  slideCenterX - distanceToBorder, slideCenterY + distanceToBorder];
      // console.log(staticBorders);
    };

    var drawLine = function(start, finish){
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      ctx.lineTo(finish[0], finish[1]);
      ctx.lineWidth = border.size;
      ctx.strokeStyle = "white";
      ctx.stroke();
    };

    var drawFullBorder = function(){
      // console.log(staticBorders);
      ctx.beginPath();
      ctx.moveTo(staticBorders.topLeftStart[0],     staticBorders.topLeftStart[1]);
      ctx.lineTo(staticBorders.topRightStart[0],    staticBorders.topRightStart[1]);
      ctx.lineTo(staticBorders.bottomRightStart[0], staticBorders.bottomRightStart[1]);
      ctx.lineTo(staticBorders.bottomLeftStart[0],  staticBorders.bottomLeftStart[1]);
      ctx.lineTo(staticBorders.topLeftStart[0],     staticBorders.topLeftStart[1] - halfBorder);

      ctx.lineWidth = border.size;
      ctx.strokeStyle = "#BADA55";
      ctx.stroke();
    };


    var animateBorder = function(){
      switch(true){
        // Increase line length until it has reach the size of a square side
        case (animatedBorders.topLineLength + incrementThreshold) < squareSide:
          animatedBorders.topLineLength += increment;

          if(animatedBorders.topLineLength >= 0){ // Ignore the offset given to delay animation
            border.toRight = [animatedBorders.topLeftStart[0] + animatedBorders.topLineLength, animatedBorders.topLeftStart[1]];
            drawLine(animatedBorders.topLeftStart, border.toRight);
          }
          break;

        case (animatedBorders.rightLineLength + incrementThreshold) < squareSide:
          animatedBorders.rightLineLength += increment;
          border.toBottom = [ slideCenterX + distanceToBorder, slideCenterY - distanceToBorder - halfBorder + animatedBorders.rightLineLength ];
          drawLine(animatedBorders.topRightStart, border.toBottom);
          break;

        case (animatedBorders.bottomLineLength + incrementThreshold) < squareSide:
          animatedBorders.bottomLineLength += increment;
          border.toLeft = [slideCenterX + distanceToBorder + halfBorder - animatedBorders.bottomLineLength , slideCenterY + distanceToBorder ];
          drawLine(animatedBorders.bottomRightStart, border.toLeft);
          break;

        case (animatedBorders.leftLineLength + incrementThreshold) < squareSide:
          animatedBorders.leftLineLength += increment;
          border.toTop = [  slideCenterX - distanceToBorder, slideCenterY + distanceToBorder + halfBorder - animatedBorders.leftLineLength ];
          drawLine(animatedBorders.bottomLeftStart, border.toTop);
          break;
        default:
          ns.SliderObj.zoomInOne();
          break;
      }
    };


    var init = function (){
    };

    init();

    return {
      clearCanvas:                  clearCanvas,
      resizeCanvas:                 resizeCanvas,
      animateBorder:                animateBorder,
      drawFullBorder:               drawFullBorder,
      calculateBorders:             calculateBorders,
      setStartingBorderAttributes:  setStartingBorderAttributes
    };

  };
})(window.Caviar);