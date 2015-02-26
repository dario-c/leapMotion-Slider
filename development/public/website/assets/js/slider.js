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

      var imagesRoot = "website/assets/images/";
      var left = "left";
      var right = "right";
      var up = "up";
      var down = "down";

      // DOM Elements and Attributes
      var $wrap = $("#wrap")[0];
      var $canvas = $(".feedback-canvas")[0];
      var $frame = $(".frame");
      var $slideDivs;
      var oneSlide;
      var slidesSize;
      var wrapAttr = $wrap.getBoundingClientRect();

      // States Variables
      var transitioning = false;
      var zoomedOut = true; // TO-DO: Change back to false

      var centerPositionsFound = false;
      var columnsCenters;
      var rowsCenters;
      
      // Selected Element Attributes
      var selectedColumnClass;
      var selectedRowClass;
      var selectedColumnIndex;
      var selectedRowIndex;


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
            var $newSlide = $("<div></div>");
            $newSlide.addClass(rows[x].name + " " + columns[y].name + " " + rows[x].posClass + " " +columns[y].posClass);
            $newSlide.css({ "background-image": "url(" + imagesRoot + rows[x].artist + "-0" + (y+2) + rows[x].extension + ")"});

            slides.push($newSlide);
          }
        }
        $frame.append(slides);
        $slideDivs = $frame.find("div");
        oneSlide = $slideDivs.first()[0];
      };

      var resizeCanvas = function(){
        wrapAttr = $wrap.getBoundingClientRect();
        $canvas.width = wrapAttr.width;
        $canvas.height = wrapAttr.height;
      };

      var controller = new Leap.Controller();

      var changeClass = function(columnOrRow, posiblePositions, positive) {
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


      var slide = function(direction) {
        switch(direction){
          case left:
            changeClass(columns, posibleXPositions, false); // left
            break;
          case up:
            changeClass(rows, posibleYPositions, true); // up
            break;
          case right:
            changeClass(columns, posibleXPositions, true); // right
            break;
          case down:
            changeClass(rows, posibleYPositions, false); // down
            break;
        }
        transitioning = true;
      };


      var processFrame = function(frame){
        if(frame.hands.length > 0){
          var process = zoomedOut ? processFrameZoomedOut : processFrameZoomedIn;
          process(frame);
        }
      };

      var processFrameZoomedOut = function(frame){
            selectSlide(frame);
      };

      var processFrameZoomedIn = function(frame){
        var hand = frame.hands[0];

        var translation = hand.translation(controller.frame(10));
        var translationX = translation[0];
        var translationY = translation[1];

        var horizontal = Math.abs(translationX) > Math.abs(translationY) ? true : false;

        if(!transitioning){

          if(frame.hands.length >= 2){
            var hand2 = frame.hands[1];
            var finger1Position = hand.pointables[1].stabilizedTipPosition;
            var finger2Position = hand2.pointables[1].stabilizedTipPosition;

            if(Math.abs(finger1Position[0] - finger2Position[0]) < 50 && Math.abs(finger1Position[1] - finger2Position[1]) < 10){
              transitioning = true;
              zoomOut();
            }
          }
          
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
        }
      };


      var lastSelectedIndexes = [];

      var selectSlide = function(frame){
        var interactionBox = frame.interactionBox;
        var normalizedPosition = interactionBox.normalizePoint(frame.pointables[0].tipPosition, true);

        var tipPositionInWrapX = Math.round((wrapAttr.width) * normalizedPosition[0]); // Number between 0 and the wrap-width
        var tipPositionInWrapY = Math.round((wrapAttr.height) * (1 - normalizedPosition[1])); //  Number bzetween 0 and the wrap-height

        var columnDistanceToTip = [];
        var rowDistanceToTip = [];

        // Find how far tbe center of the slides are from the pointing finger
        for(var x = 0; x < columnsCenters.length; x++){
          columnDistanceToTip.push(Math.abs(tipPositionInWrapX - columnsCenters[x]));
          rowDistanceToTip.push(Math.abs(tipPositionInWrapY - rowsCenters[x]));
        }

        // Get the slide that is closest to pointing finger
        selectedColumnIndex =  columnDistanceToTip.indexOf(Math.min.apply(null, columnDistanceToTip));
        selectedRowIndex = rowDistanceToTip.indexOf(Math.min.apply(null, rowDistanceToTip));

        // Check if there has been no change
        if(lastSelectedIndexes[0] === selectedColumnIndex && lastSelectedIndexes[1] === selectedRowIndex && !transitioning){
          animateBorder();
        } else {
          lastSelectedIndexes = [];
          lastSelectedIndexes.push(selectedColumnIndex, selectedRowIndex);

          restartBorderAttributes();
          addClassSelected();
          
        }
      };

      var restartBorderAttributes = function(){
        clearCanvas();
        border = {};
        border.size = 13;
        leftLineLength = rightLineLength = bottomLineLength = 0;
        topLineLength = -250;
      };
      
      var addClassSelected = function(){
        selectedColumnClass = posibleXPositionsReversed[selectedColumnIndex];
        selectedRowClass = posibleYPositions[selectedRowIndex];

        // $slideDivs.removeClass("selected");
        // $("." + selectedColumnClass + "." + selectedRowClass).addClass("selected");
        drawBorder();
      };

      var findCenterPositionsOfAllSlides = function(){
        if(!centerPositionsFound){
          centerPositionsFound = true;
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
        }
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
        $(".frame").toggleClass("zoomed-out");
        zoomedOut = !zoomedOut;
        // oneSlide.on("transitionend", findCenterPositionsOfAllSlides);
      };


      // Helper Functions for Center in a Slide
      var findRowClassOffset = function (colClass) {
          var offset = Math.floor(posibleYPositions.length / 2) - posibleYPositions.indexOf(colClass);
          return offset;
      };

      var findColumnClassOffset = function (rowClass) {
          var offset = Math.floor(posibleYPositions.length / 2) - posibleXPositions.indexOf(rowClass);
          return offset;
      };

      // Callback after transitionend event
      var endSliding = function(){
        transitioning = false;
      };

      var canvas = $(".feedback-canvas")[0];
      var ctx = canvas.getContext("2d");


      var topLineLength = -250;
      var rightLineLength = 0;
      var bottomLineLength= 0;
      var leftLineLength = 0;
      var increment = 7;
      var incrementThreshold = increment + Math.floor(increment / 2);

      var border = {};
      border.size = 10;

      var chosenOne = false;

      var animateBorder = function(){
        // console.log(slidesSize, "<-");
        var slideCenterX = columnsCenters[selectedColumnIndex];
        var slideCenterY = rowsCenters[selectedRowIndex];
        var halfBorder = border.size / 2;
        var distanceToBorder = (slidesSize[0] / 2) + halfBorder;

        // Start at Top-left corner
        var start = [ slideCenterX - distanceToBorder - halfBorder, slideCenterY - distanceToBorder];
        var topRightStart = [  slideCenterX + distanceToBorder, slideCenterY - distanceToBorder - halfBorder];
        var bottomRightStart = [  slideCenterX + distanceToBorder + halfBorder, slideCenterY + distanceToBorder];
        var bottomLeftStart = [  slideCenterX - distanceToBorder, slideCenterY + distanceToBorder + halfBorder];

        var squareSide = slidesSize[0] + (border.size * 2);

        border.start = [start[0], start[1]];

        if (chosenOne) {
          // console.log("decision taken");
          var rowClassOffset = findRowClassOffset(selectedRowClass);
          var columnClassOffset = findColumnClassOffset(selectedColumnClass);
          bringToCenter(rowClassOffset, columnClassOffset);
          $(".frame").toggleClass("zoomed-out");
          clearCanvas();
          zoomedOut = !zoomedOut;
          chosenOne = false;
        } else {

          switch(true){
            case (topLineLength + incrementThreshold) < squareSide:
              topLineLength += increment;
              border.toRight = [start[0] + topLineLength, start[1]];
              drawLine(border.start, border.toRight);
              break;

            case (rightLineLength + incrementThreshold) < squareSide:
              rightLineLength += increment;
              border.toBottom = [ slideCenterX + distanceToBorder, slideCenterY - distanceToBorder - halfBorder + rightLineLength ];
              drawLine(topRightStart, border.toBottom);
              break;

            case (bottomLineLength + incrementThreshold) < squareSide:
              bottomLineLength += increment;
              border.toLeft = [slideCenterX + distanceToBorder + halfBorder - bottomLineLength , slideCenterY + distanceToBorder ];
              drawLine(bottomRightStart, border.toLeft);
              break;

            case (leftLineLength + incrementThreshold) < squareSide:
              leftLineLength += increment;
              border.toTop = [  slideCenterX - distanceToBorder, slideCenterY + distanceToBorder + halfBorder - leftLineLength ];
              drawLine(bottomLeftStart, border.toTop);
              break;
            default:
              chosenOne = true;
              break;
          }
        }

      };

      var drawLine = function(start, finish){
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(finish[0], finish[1]);
        ctx.lineWidth = border.size;
        ctx.strokeStyle = "white";
        ctx.stroke();
      };

      var clearCanvas = function(){
        ctx.clearRect(0, 0, 950, 950);
      };

      var drawBorder = function(){
        console.log("HERE");

        var slideCenterX = columnsCenters[selectedColumnIndex];
        var slideCenterY = rowsCenters[selectedRowIndex];
        var halfBorder = border.size / 2;
        var distanceToBorder = (slidesSize[0] / 2) + halfBorder;

        // Start at Top-left corner
        var start = [ slideCenterX - distanceToBorder, slideCenterY - distanceToBorder];
        var topRightStart = [  slideCenterX + distanceToBorder, slideCenterY - distanceToBorder];
        var bottomRightStart = [  slideCenterX + distanceToBorder, slideCenterY + distanceToBorder];
        var bottomLeftStart = [  slideCenterX - distanceToBorder, slideCenterY + distanceToBorder];

        border.start = [start[0], start[1]];

        ctx.clearRect(0, 0, 950, 950);
        ctx.beginPath();

        ctx.moveTo(start[0],start[1]);
        ctx.lineTo(topRightStart[0], topRightStart[1]);
        ctx.lineTo(bottomRightStart[0], bottomRightStart[1]);
        ctx.lineTo(bottomLeftStart[0], bottomLeftStart[1]);
        ctx.lineTo(start[0],start[1] - halfBorder);

        ctx.lineWidth = border.size;
        ctx.strokeStyle = "#BADA55";
        ctx.stroke();
      };

      var adaptValuesToScreen = function(){
        resizeCanvas();
        centerPositionsFound = false;

        var oneSlide = $slideDivs.first();
        slidesSize = findElementsSize(oneSlide[0]);
        
        findCenterPositionsOfAllSlides();
        // console.log("adapted ", centerPositionsFound);
      };


      var init = function (){
        appendSlides();

        // TO-DO findCenterPositionsOfAllSlides might only be needed in Zooming-out
        resizeCanvas();
        findCenterPositionsOfAllSlides();

        controller.on("frame", processFrame);
        controller.connect();

        window.onresize = adaptValuesToScreen;

        var oneSlide = $slideDivs.first();
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
                $(".frame").toggleClass("zoomed-out");
                zoomedOut = !zoomedOut;

                var rowClassOffset = findRowClassOffset(selectedRowClass);
                var columnClassOffset = findColumnClassOffset(selectedColumnClass);
                bringToCenter(rowClassOffset, columnClassOffset);
                break;
            }
          });
        }
      };
      init();
    };

})(window.Caviar);