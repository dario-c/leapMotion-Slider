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

    var imagesRoot = "website/assets/images/";

    // External Modules
    var Canvas = ns.CanvasObj;
    var LeapActions = ns.LeapObj;

    // DOM Elements
    var $frame = $(".frame");
    var oneSlide;

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
      ns.$slideDivs = $frame.find("div");
    };

    var slide = function(direction) {
      switch(direction){
        case ns.left:
          changeClasses(columns, posibleXPositions, false); // left
          break;
        case ns.up:
          changeClasses(rows, posibleYPositions, true); // up
          break;
        case ns.right:
          changeClasses(columns, posibleXPositions, true); // right
          break;
        case ns.down:
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

    var findSlideDistanceToPosition = function(positionX, positionY, distancesToTip){
      for(var x = 0; x < ns.columnsCenters.length; x++){
        distancesToTip.columns.push(Math.abs(positionX - ns.columnsCenters[x]));
        distancesToTip.rows.push(Math.abs(positionY - ns.rowsCenters[x]));
      }
    };

    var getIndexesOfClosestSlide = function(distancesToTip){
      ns.selectedSlide.columnIndex =  distancesToTip.columns.indexOf(Math.min.apply(null, distancesToTip.columns));
      ns.selectedSlide.rowIndex = distancesToTip.rows.indexOf(Math.min.apply(null, distancesToTip.rows));
    };


    var selectSlide = function(){
      ns.selectedSlide.columnClass = posibleXPositionsReversed[ns.selectedSlide.columnIndex];
      ns.selectedSlide.rowClass = posibleYPositions[ns.selectedSlide.rowIndex];
      Canvas.drawFullBorder();
    };

    var findCenterPositionsOfAllSlides = function(){
      ns.columnsCenters = [];
      ns.rowsCenters = [];

      ns.$slideDivs.each(function(i){
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
        slide(ns.down);
        rowDistance--;
        bringToCenter(rowDistance, columnDistance);

      } else if (rowDistance < 0) {
        slide(ns.up);
        rowDistance++;
        bringToCenter(rowDistance, columnDistance);
      
      } else {

        if (columnDistance > 0) {
          slide(ns.left);
          columnDistance--;
          bringToCenter(rowDistance, columnDistance);

        } else if (columnDistance < 0) {
          slide(ns.right);
          columnDistance++;
          bringToCenter(rowDistance, columnDistance);
        }
      }
    };

    var zoomOut = function(){
      ns.transitioning = true;
      Canvas.clearCanvas();
      Canvas.setStartingBorderAttributes();
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

    var zoomInOne = function(){
      var rowClassOffset = findRowClassOffset(ns.selectedSlide.rowClass);
      var columnClassOffset = findColumnClassOffset(ns.selectedSlide.columnClass);

      bringToCenter(rowClassOffset, columnClassOffset);
      $(".frame").toggleClass("zoomed-out");
      ns.zoomedOut = !ns.zoomedOut;
      ns.transitioning = true;
      Canvas.clearCanvas();
    };

    var adaptValuesToScreenSize = function(){
      Canvas.resizeCanvas();

      ns.slidesSize = findElementsSize(ns.oneSlide[0]);

      findCenterPositionsOfAllSlides();
      Canvas.setStartingBorderAttributes();
    };


    return {
    slide:                          slide,
    zoomOut:                        zoomOut,
    zoomInOne:                      zoomInOne,
    endSliding:                     endSliding,
    selectSlide:                    selectSlide,
    appendSlides:                   appendSlides,
    findElementsSize:               findElementsSize,
    adaptValuesToScreenSize:        adaptValuesToScreenSize,
    getIndexesOfClosestSlide:       getIndexesOfClosestSlide,
    findSlideDistanceToPosition:    findSlideDistanceToPosition,
    findCenterPositionsOfAllSlides: findCenterPositionsOfAllSlides
    };

  };

})(window.Caviar);