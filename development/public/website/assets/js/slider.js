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
    ns.Slider = function ()
    {
      var translationThreshold = 165;
      var controller = new Leap.Controller();

      var imagesRoot = "website/assets/images/";
      var left = "left";
      var right = "right";
      var up = "up";
      var down = "down";

      // DOM Elements and Elements' Attributes
      var $wrap = $("#wrap")[0];
      var $canvas = $(".feedback-canvas")[0];
      var $frame = $(".frame");
      var $slideDivs;
      var oneSlide;
      var slidesSize;
      var wrapAttr = $wrap.getBoundingClientRect();

      // States Variables
      var transitioning = false;
      var zoomedOut = true;

      var selectedSlide = {};
      var lastSelectedIndexes = [];

      var columnsCenters;
      var rowsCenters;

      var posibleXPositions = ["rightest", "right", "middle", "left", "leftest" ];
      var posibleYPositions = ["topmost", "top", "center", "bottom", "bottommost"];
      var posibleXPositionsReversed = [];

      for(var x = 0; posibleXPositions.length > x; x++){
        posibleXPositionsReversed.push(posibleXPositions[x]);
      }
      posibleXPositionsReversed.reverse();

      var col1 = {name: "col-1", posClass: "leftest"};
      var col2 = {name: "col-2", posClass: "left"};
      var col3 = {name: "col-3", posClass: "middle"};
      var col4 = {name: "col-4", posClass: "right"};
      var col5 = {name: "col-5", posClass: "rightest"};
      
      var columns = [col1, col2, col3, col4, col5];

      var row1 = {name: "row-1", posClass: "topmost",    artist: "CraigKarl",   extension: ".jpg"};
      var row2 = {name: "row-2", posClass: "top",        artist: "DanMatutina", extension: ".jpg"};
      var row3 = {name: "row-3", posClass: "center",     artist: "JamieCullen", extension: ".jpg"};
      var row4 = {name: "row-4", posClass: "bottom",     artist: "JMTixier",    extension: ".jpg"};
      var row5 = {name: "row-5", posClass: "bottommost", artist: "RobinDavey",  extension: ".gif"};
      
      var rows = [row1, row2, row3, row4, row5];

      var appendSlides = function(){
        var slides = [];
        for(var x = 0; x < rows.length; x++){
          for(var y = 0; y < columns.length; y++ ){
            var $newSlide = $("<div data-artist=" + rows[x].artist + "></div>");
            $newSlide.addClass(rows[x].name + " " + columns[y].name + " " + rows[x].posClass + " " +columns[y].posClass);
            $newSlide.css({ "background-image": "url(" + imagesRoot + rows[x].artist + "-0" + (y+1) + rows[x].extension + ")"});

            slides.push($newSlide);
          }
        }
        $frame.append(slides);
        $slideDivs = $frame.find("div");
        oneSlide = $slideDivs.first()[0];
      };

      var slide = function(direction) {
        switch(direction){
          case left:
            changeClasses(columns, posibleXPositions, false); // left
            break;
          case up:
            changeClasses(rows, posibleYPositions, true); // up
            break;
          case right:
            changeClasses(columns, posibleXPositions, true); // right
            break;
          case down:
            changeClasses(rows, posibleYPositions, false); // down
            break;
        }
        transitioning = true;
      };

      var changeClasses = function(columnOrRow, posiblePositions, positive) {
         // Loop through all Columns or Rows
        for(var x = 0; x < columnOrRow.length; x++) {
          // Update elements attributes
          updateElement(columnOrRow[x], posiblePositions, positive);
          // Apply changes to positioning Classes
          $("."+columnOrRow[x].name)
            .addClass(columnOrRow[x].posClass)
            .removeClass(columnOrRow[x].oldClass);
        }
      };

      var updateElement = function(columnOrRow, posiblePositions, positive){
        var oldPosition = posiblePositions.indexOf(columnOrRow.posClass);
        var newPosition = positive ? oldPosition - 1 : oldPosition + 1;

        columnOrRow.oldClass = columnOrRow.posClass;

        if(!positive && newPosition >= posiblePositions.length) {

          columnOrRow.posClass = posiblePositions[0];

        } else if(positive && newPosition < 0) {

          columnOrRow.posClass = posiblePositions[posiblePositions.length - 1];

        } else {
          columnOrRow.posClass = posiblePositions[newPosition];
        }
      };

      var resizeCanvas = function(){
        wrapAttr = $wrap.getBoundingClientRect();
        $canvas.width = wrapAttr.width;
        $canvas.height = wrapAttr.height;
      };

      var processFrame = function(frame){
        if(frame.hands.length > 0 && !transitioning){
          var process = zoomedOut ? processZoomedOutFrame : processZoomedInFrame;
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
          zoomOut();
        }
      };

      var processMainHand = function(hand, frame){
        var translation = hand.translation(controller.frame(10));
        var translationX = translation[0];
        var translationY = translation[1];

        var horizontal = Math.abs(translationX) > Math.abs(translationY) ? true : false;

        if(horizontal) {
          if(translationX < -translationThreshold) {
            slide(left);
          } else if (translationX > translationThreshold)  {
            slide(right);
          }
        } else {

          if(translationY < -translationThreshold) {
            slide(down);
          } else if (translationY > translationThreshold ) {
            slide(up);
          }
        }
      };

      var processPointingFinger = function(frame){
        var interactionBox = frame.interactionBox;
        var normalizedPosition = interactionBox.normalizePoint(frame.pointables[0].tipPosition, true);

        var tipPositionInWrapX = Math.round((wrapAttr.width) * normalizedPosition[0]); // Number between 0 and the wrap-width
        var tipPositionInWrapY = Math.round((wrapAttr.height) * (1 - normalizedPosition[1])); //  Number between 0 and the wrap-height

        var distancesToTip = {columns: [], rows: []};

        findSlideDistanceToPosition(tipPositionInWrapX, tipPositionInWrapY, distancesToTip);
        getIndexesOfClosestSlide(distancesToTip);

        // Check if there has been no change since last frame
        if(lastSelectedIndexes[0] === selectedSlide.columnIndex && lastSelectedIndexes[1] === selectedSlide.rowIndex){
          calculateBorders(true);
          animateBorder();
        } else {
          lastSelectedIndexes = [];
          lastSelectedIndexes.push(selectedSlide.columnIndex, selectedSlide.rowIndex);

          setStartingBorderAttributes();
          calculateBorders(false);

          selectSlide();
        }
      };

      var findSlideDistanceToPosition = function(positionX, positionY, distancesToTip){
        for(var x = 0; x < columnsCenters.length; x++){
          distancesToTip.columns.push(Math.abs(positionX - columnsCenters[x]));
          distancesToTip.rows.push(Math.abs(positionY - rowsCenters[x]));
        }
      };

      var getIndexesOfClosestSlide = function(distancesToTip){
        selectedSlide.columnIndex =  distancesToTip.columns.indexOf(Math.min.apply(null, distancesToTip.columns));
        selectedSlide.rowIndex = distancesToTip.rows.indexOf(Math.min.apply(null, distancesToTip.rows));
      };

      var setStartingBorderAttributes = function(){
        clearCanvas();
        border = {};
        border.size = 13;
        animatedBorders.leftLineLength = animatedBorders.rightLineLength = animatedBorders.bottomLineLength = 0;
        animatedBorders.topLineLength = -250;
      };

      var selectSlide = function(){
        selectedSlide.columnClass = posibleXPositionsReversed[selectedSlide.columnIndex];
        selectedSlide.rowClass = posibleYPositions[selectedSlide.rowIndex];
        drawFullBorder();
      };

      var findCenterPositionsOfAllSlides = function(){
        columnsCenters = [];
        rowsCenters = [];

        $slideDivs.each(function(i){
          if(i < columns.length){
            columnsCenters.push(findElementsCenterPosition(this)[0]);
          }
          if(i % rows.length === 0){
            rowsCenters.push(findElementsCenterPosition(this)[1]);
          }
        });
        columnsCenters.sort(sortNumber);
        rowsCenters.sort(sortNumber);
      };

      var findElementsCenterPosition = function($element){
        var elementAttr = $element.getBoundingClientRect();
        return [Math.round(elementAttr.left + (elementAttr.width / 2) - wrapAttr.left), Math.round(elementAttr.top + (elementAttr.height / 2) - wrapAttr.top)];
      };

      var findElementsSize = function($element){
        var elementAttr = $element.getBoundingClientRect();
        return [Math.round(elementAttr.width), Math.round(elementAttr.height)];
      };

      var sortNumber = function(a,b) {
        return a - b;
      };

      var bringToCenter = function (rowDistance, columnDistance) {
        if (rowDistance > 0) {
          slide(down);
          rowDistance--;
          bringToCenter(rowDistance, columnDistance);

        } else if (rowDistance < 0) {
          slide(up);
          rowDistance++;
          bringToCenter(rowDistance, columnDistance);
        
        } else {

          if (columnDistance > 0) {
            slide(left);
            columnDistance--;
            bringToCenter(rowDistance, columnDistance);

          } else if (columnDistance < 0) {
            slide(right);
            columnDistance++;
            bringToCenter(rowDistance, columnDistance);
          }
        }
      };

      var zoomOut = function(){
        transitioning = true;
        clearCanvas();
        setStartingBorderAttributes();
        $(".frame").toggleClass("zoomed-out");
        zoomedOut = !zoomedOut;
      };

      var findRowClassOffset = function (colClass) {
        var offset = Math.floor(posibleYPositions.length / 2) - posibleYPositions.indexOf(colClass);
        return offset;
      };

      var findColumnClassOffset = function (rowClass) {
        var offset = Math.floor(posibleYPositions.length / 2) - posibleXPositions.indexOf(rowClass);
        return offset;
      };

      var endSliding = function(){
        transitioning = false;
      };

      var ctx = $canvas.getContext("2d");

      var slideCenterX, slideCenterY, halfBorder, distanceToBorder, squareSide;
      var border;

      var increment = 7;
      var incrementThreshold = increment + Math.floor(increment / 2);

      var staticBorders = {};
      var animatedBorders = {};

      var calculateBorders = function(animated){
        slideCenterX = columnsCenters[selectedSlide.columnIndex];
        slideCenterY = rowsCenters[selectedSlide.rowIndex];
        halfBorder = border.size / 2;
        distanceToBorder = (slidesSize[0] / 2) + halfBorder;

        var findBorders = animated ? findCornersAnimatedBorder : findCornersStaticBorder;
        findBorders();
      };

      var findCornersStaticBorder = function(){
        staticBorders.topLeftStart = [     slideCenterX - distanceToBorder, slideCenterY - distanceToBorder];
        staticBorders.topRightStart = [    slideCenterX + distanceToBorder, slideCenterY - distanceToBorder];
        staticBorders.bottomRightStart = [ slideCenterX + distanceToBorder, slideCenterY + distanceToBorder];
        staticBorders.bottomLeftStart = [  slideCenterX - distanceToBorder, slideCenterY + distanceToBorder];
      };

      var findCornersAnimatedBorder = function(){
        animatedBorders.topLeftStart = [     slideCenterX - distanceToBorder - halfBorder, slideCenterY - distanceToBorder];
        animatedBorders.topRightStart = [    slideCenterX + distanceToBorder,              slideCenterY - distanceToBorder - halfBorder];
        animatedBorders.bottomRightStart = [ slideCenterX + distanceToBorder + halfBorder, slideCenterY + distanceToBorder];
        animatedBorders.bottomLeftStart = [  slideCenterX - distanceToBorder,              slideCenterY + distanceToBorder + halfBorder];

        squareSide = slidesSize[0] + (border.size * 2);
      };

      var drawFullBorder = function(){
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

      var drawLine = function(start, finish){
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(finish[0], finish[1]);
        ctx.lineWidth = border.size;
        ctx.strokeStyle = "white";
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
            zoomInOne();
            break;
        }
      };


      var zoomInOne = function(){
        var rowClassOffset = findRowClassOffset(selectedSlide.rowClass);
        var columnClassOffset = findColumnClassOffset(selectedSlide.columnClass);

        bringToCenter(rowClassOffset, columnClassOffset);
        $(".frame").toggleClass("zoomed-out");
        zoomedOut = !zoomedOut;
        transitioning = true;
        clearCanvas();
      };


      var clearCanvas = function(){
        ctx.clearRect(0, 0, $canvas.width, $canvas.height);
      };

      var adaptValuesToScreenSize = function(){
        resizeCanvas();

        oneSlide = $slideDivs.first();
        slidesSize = findElementsSize(oneSlide[0]);
        
        findCenterPositionsOfAllSlides();
        setStartingBorderAttributes();
      };


      var init = function (){
        appendSlides();

        resizeCanvas();
        findCenterPositionsOfAllSlides();

        controller.on("frame", processFrame);
        controller.connect();

        window.onresize = adaptValuesToScreenSize;

        oneSlide = $slideDivs.first();
        slidesSize = findElementsSize(oneSlide[0]);
        oneSlide.on("transitionend", endSliding);

        // Just for Debugging 
        if(ns.DEBUG){
          $(document).ready(function(){
            $(document.body).on("mouseover", function(e){
              var elem = document.elementFromPoint(e.pageX, e.pageY);
              
              $slideDivs.removeClass("selected");
              $(elem).addClass("selected");
            });
          });

          $(ns.body).on("keydown", function(key){
            switch(key.keyCode){
              case 37:
                slide(left);
                break;
              case 38:
                slide(up);
                break;
              case 39:
                slide(right);
                break;
              case 40:
                slide(down);
                break;
              case 90:
                zoomOut();
                break;
              case 67:
                zoomInOne();
                break;
            }
          });
        }
      };
      init();
    };

})(window.Caviar);