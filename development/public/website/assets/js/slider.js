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
      var controller = ns.controller;

      var imagesRoot = "website/assets/images/";
      var left = ns.left;
      var right = ns.right;
      var up = ns.up;
      var down = ns.down;




      // CANVAS FUNCTIONS
      var Canvas = ns.Canvas();
      var drawLine = Canvas.drawLine;
      var drawFullBorder = Canvas.drawFullBorder;
      var clearCanvas = Canvas.clearCanvas;
      var calculateBorders = Canvas.calculateBorders;
      var animateBorder = Canvas.animateBorder;
      var resizeCanvas = Canvas.resizeCanvas;
      var setStartingBorderAttributes = Canvas.setStartingBorderAttributes;

      // LEAP FUNCTIONS
      var LeapActions = ns.LeapActions();
      var processFrame = LeapActions.processFrame;
      var processZoomedOutFrame = LeapActions.processZoomedOutFrame;


      var $frame = $(".frame");
      var $slideDivs;
      var oneSlide;

      // States Variables
      ns.transitioning = false;
      ns.zoomedOut = true;



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

      ns.slide = function(direction) {
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
        ns.transitioning = true;
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





      ns.findSlideDistanceToPosition = function(positionX, positionY, distancesToTip){
        for(var x = 0; x < ns.columnsCenters.length; x++){
          distancesToTip.columns.push(Math.abs(positionX - ns.columnsCenters[x]));
          distancesToTip.rows.push(Math.abs(positionY - ns.rowsCenters[x]));
        }
      };

      ns.getIndexesOfClosestSlide = function(distancesToTip){
        ns.selectedSlide.columnIndex =  distancesToTip.columns.indexOf(Math.min.apply(null, distancesToTip.columns));
        ns.selectedSlide.rowIndex = distancesToTip.rows.indexOf(Math.min.apply(null, distancesToTip.rows));
      };



      ns.selectSlide = function(){
        ns.selectedSlide.columnClass = posibleXPositionsReversed[ns.selectedSlide.columnIndex];
        ns.selectedSlide.rowClass = posibleYPositions[ns.selectedSlide.rowIndex];
        drawFullBorder();
      };

      var findCenterPositionsOfAllSlides = function(){
        ns.columnsCenters = [];
        ns.rowsCenters = [];

        $slideDivs.each(function(i){
          if(i < columns.length){
            ns.columnsCenters.push(findElementsCenterPosition(this)[0]);
          }
          if(i % rows.length === 0){
            ns.rowsCenters.push(findElementsCenterPosition(this)[1]);
          }
        });
        ns.columnsCenters.sort(sortNumber);
        ns.rowsCenters.sort(sortNumber);
      };

      var findElementsCenterPosition = function($element){
        var elementAttr = $element.getBoundingClientRect();
        return [Math.round(elementAttr.left + (elementAttr.width / 2) - ns.wrapAttr.left), Math.round(elementAttr.top + (elementAttr.height / 2) - ns.wrapAttr.top)];
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
          ns.slide(down);
          rowDistance--;
          bringToCenter(rowDistance, columnDistance);

        } else if (rowDistance < 0) {
          ns.slide(up);
          rowDistance++;
          bringToCenter(rowDistance, columnDistance);
        
        } else {

          if (columnDistance > 0) {
            ns.slide(left);
            columnDistance--;
            bringToCenter(rowDistance, columnDistance);

          } else if (columnDistance < 0) {
            ns.slide(right);
            columnDistance++;
            bringToCenter(rowDistance, columnDistance);
          }
        }
      };

      ns.zoomOut = function(){
        ns.transitioning = true;
        clearCanvas();
        setStartingBorderAttributes();
        $(".frame").toggleClass("zoomed-out");
        ns.zoomedOut = !ns.zoomedOut;
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
        ns.transitioning = false;
      };

      ns.zoomInOne = function(){
        var rowClassOffset = findRowClassOffset(ns.selectedSlide.rowClass);
        var columnClassOffset = findColumnClassOffset(ns.selectedSlide.columnClass);

        bringToCenter(rowClassOffset, columnClassOffset);
        $(".frame").toggleClass("zoomed-out");
        ns.zoomedOut = !ns.zoomedOut;
        ns.transitioning = true;
        clearCanvas();
      };

      var adaptValuesToScreenSize = function(){
        resizeCanvas();

        oneSlide = $slideDivs.first();
        ns.slidesSize = findElementsSize(oneSlide[0]);
        
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
        ns.slidesSize = findElementsSize(oneSlide[0]);
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
                ns.slide(left);
                break;
              case 38:
                ns.slide(up);
                break;
              case 39:
                ns.slide(right);
                break;
              case 40:
                ns.slide(down);
                break;
              case 90:
                ns.zoomOut();
                break;
              case 67:
                ns.zoomInOne();
                break;
            }
          });
        }
      };
      init();
    };

})(window.Caviar);