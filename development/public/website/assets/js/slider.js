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
      var left = "left";
      var right = "right";
      var up = "up";
      var down = "down";

      var imagesRoot = "website/assets/images/";

      var oneSlide = $(".frame").find("div").first();

      var posibleXPositions = ["rightest", "right", "middle", "left", "leftest" ];
      var posibleYPositions = ["topmost", "top", "center", "bottom", "bottommost"];

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

      var slide = function(columnOrRow, posiblePositions, positive) {
         // Loop through all Columns or Rows
        for(var x = 0; x < columnOrRow.length; x++) {
          // Update elements attributes
          updateElement(columnOrRow[x], posiblePositions, positive);
          // Apply changes to posClasses
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

      var appendImages = function(){
        for(var x = 0; x < rows.length; x++){
          for(var y = 0; y < columns.length; y++ ){
          $("." + rows[x].name + "." + columns[y].name).css({ "background-image": "url(" + imagesRoot + rows[x].artist + "-0" + (y+2) + rows[x].extension + ")"});
          }
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

      var animating = false;
      var controller = new Leap.Controller();

      var processFrame = function(frame){
        if(frame.hands.length > 0){
          var hand = frame.hands[0];
          
          var translation = hand.translation(controller.frame(10));
          var translationX = translation[0];
          var translationY = translation[1];
          
          var translationThreshold = 175;

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
        }
      };

      var endAnimating = function(){
        animating = false;
      };

      var init = function (){
        appendImages();

        controller.on("frame", processFrame);
        controller.connect();

        oneSlide.on("transitionend", endAnimating);

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
                break;
            }
          });
        }
      };

      init();
    };

})(window.Caviar);