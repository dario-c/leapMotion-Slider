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
      var translationThreshold = 150;

      var left = "left";
      var right = "right";
      var up = "up";
      var down = "down";

      var imagesRoot = "website/assets/images/";
      var $frame = $(".frame");
      var $slideDivs;
      var zoomedOut = false;

      var posibleXPositions = ["rightest", "right", "middle", "left", "leftest" ];
      var posibleYPositions = ["topmost", "top", "center", "bottom", "bottommost"];
      var posibleXPositionsReversed = posibleXPositions.reverse();

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
            var $newElement = $("<div></div>");
            $newElement.addClass(rows[x].name + " " + columns[y].name + " " + rows[x].posClass + " " +columns[y].posClass);
            $newElement.css({ "background-image": "url(" + imagesRoot + rows[x].artist + "-0" + (y+2) + rows[x].extension + ")"});

            slides.push($newElement);
          }
        }
        $frame.append(slides);
        $slideDivs = $frame.find("div");
      };


      var animating = false;
      var controller = new Leap.Controller();


      var slide = function(columnOrRow, posiblePositions, positive) {
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


      var animate = function(direction) {
        switch(direction){
          case left:
            slide(columns, posibleXPositions, false); // left
            break;
          case up:
            slide(rows, posibleYPositions, true); // up
            break;
          case right:
            slide(columns, posibleXPositions, true); // right
            break;
          case down:
            slide(rows, posibleYPositions, false); // down
            break;
        }
        animating = true;
      };


      var processFrame = function(frame){
        if(frame.hands.length > 0){
          var process = zoomedOut ? processFrameZoomedOut : processFrameZoomedIn;
          process(frame);
        }
      };


      var processFrameZoomedOut = function(frame){
         // Check every 3 frames
          if(frame.id % 3 === 0){
            selectSlide(frame);
          }
      };


      var processFrameZoomedIn = function(frame){
        var hand = frame.hands[0];

        var translation = hand.translation(controller.frame(10));
        var translationX = translation[0];
        var translationY = translation[1];

        var horizontal = Math.abs(translationX) > Math.abs(translationY) ? true : false;

        if(!animating){

          if(horizontal) {

            if(translationX < -translationThreshold) {
              animate(left);
            } else if (translationX > translationThreshold)  {
              animate(right);
            }
          } else {

            if(translationY < -translationThreshold) {
              animate(down);
            } else if (translationY > translationThreshold ) {
              animate(up);
            }
          }
        }
      };

      var selectedColumnClass;
      var selectedRowClass;


      var selectSlide = function(frame){
        var interactionBox = frame.interactionBox;
        var normalizedPosition = interactionBox.normalizePoint(frame.pointables[0].tipPosition, true);

        var wrapXAxis = Math.round((wrapAttr.width) * normalizedPosition[0]); // Number between 0 and the wrap-width where the finger is poiting in the X axis
        var wrapYAxis = Math.round((wrapAttr.height) * (1 - normalizedPosition[1])); //  Number bzetween 0 and the wrap-height

        var columnDistanceOffset = [];
        var rowDistanceOffset = [];

        for(var x = 0; x < columnsCenters.length; x++){
          columnDistanceOffset.push(Math.abs(wrapXAxis - columnsCenters[x]));
          rowDistanceOffset.push(Math.abs(wrapYAxis - rowsCenters[x]));
        }

        var selectColumnIndex =  columnDistanceOffset.indexOf(Math.min.apply(null, columnDistanceOffset));
        var selectRowIndex = rowDistanceOffset.indexOf(Math.min.apply(null, rowDistanceOffset));

        selectedColumnClass = posibleXPositionsReversed[selectColumnIndex];
        selectedRowClass = posibleYPositions[selectRowIndex];

        $slideDivs.removeClass("selected");
        $("." + selectedColumnClass + "." + selectedRowClass).addClass("selected");
      };

      var centerPositionsFound = false;


      var findCenterPositionsOfAllSlides = function(){
          if(!centerPositionsFound){
          console.log("here");
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

      var sortNumber = function(a,b) {
          return a - b;
      };



      var selectedRow;
      var selectedColumn;

      var bringToCenter = function (rowDistance, columnDistance) {
          if (rowDistance > 0) {
              animate(down);
              rowDistance--;
              bringToCenter(rowDistance, columnDistance);
          } else if (rowDistance < 0) {
              animate(up);
              rowDistance++;
              bringToCenter(rowDistance, columnDistance);
          } else {
            if (columnDistance > 0) {
                animate(left);
                columnDistance--;
                bringToCenter(rowDistance, columnDistance);
            } else if (columnDistance < 0) {
                animate(right);
                columnDistance++;
                bringToCenter(rowDistance, columnDistance);
            }
          }
      };

      var $wrap = $("#wrap")[0];
      var wrapAttr = $wrap.getBoundingClientRect();

      var columnsCenters;
      var rowsCenters;



      // Helper Functions for Center in a Slide
      var findRowClassOffset = function () {
          var offset = Math.floor(posibleYPositions.length / 2) - posibleYPositions.indexOf(selectedRowClass);
          return offset;
      };

      var findColumnClassOffset = function () {
          var offset = Math.floor(posibleYPositions.length / 2) - posibleXPositions.indexOf(selectedColumnClass);
          return offset;
      };

      // var rowClassOffset = findRowClassOffset();
      // var columnClassOffset = findColumnClassOffset();



      // Callback after transitionend event
      var endAnimating = function(){
        animating = false;
      };


      var init = function (){
        appendSlides();

        controller.on("frame", processFrame)
          .use("screenPosition", { scale:  1 });

        controller.connect();

        var oneSlide = $slideDivs.first();
        oneSlide.on("transitionend", endAnimating);

        $(document).ready(function(){
            $(document.body).on('mouseover', function(e){
                var elem = document.elementFromPoint(e.pageX, e.pageY);
                
                $slideDivs.removeClass("selected");
                $(elem).addClass("selected");
            });
        });

        // Just for Debugging 
        if(ns.DEBUG){
          $(ns.body).on("keydown", function(key){
            switch(key.keyCode){
              case 37:
                animate(left);
                break;
              case 38:
                animate(up);
                break;
              case 39:
                animate(right);
                break;
              case 40:
                animate(down);
                break;
              case 90:
                $(".frame").toggleClass("zoomed-out");
                zoomedOut = !zoomedOut;
                oneSlide.on("transitionend", findCenterPositionsOfAllSlides);
                break;
              case 67:
                $(".frame").toggleClass("zoomed-out");
                zoomedOut = !zoomedOut;

                var rowDistance = findRowClassOffset();
                var columnDistance = findColumnClassOffset();
                bringToCenter(rowDistance, columnDistance);
                break;
            }
          });
        }
      };
      init();
    };

})(window.Caviar);