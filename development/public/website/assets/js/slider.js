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

      var posibleXPositions = ["rightest", "right", "middle", "left", "leftest" ];
      var posibleYPositions = ["topmost", "top", "center", "bottom", "bottommost"];

      var col1 = {name: "col-1", posClass: "leftest"};
      var col2 = {name: "col-2", posClass: "left"};
      var col3 = {name: "col-3", posClass: "middle"};
      var col4 = {name: "col-4", posClass: "right"};
      var col5 = {name: "col-5", posClass: "rightest"};
      
      var columns = [col1, col2, col3, col4, col5];

      var row1 = {name: "row-1", posClass: "topmost"};
      var row2 = {name: "row-2", posClass: "top"};
      var row3 = {name: "row-3", posClass: "center"};
      var row4 = {name: "row-4", posClass: "bottom"};
      var row5 = {name: "row-5", posClass: "bottommost"};
      
      var rows = [row1, row2, row3, row4, row5];

       function slide(columnOrRow, posiblePositions, positive) {
         // Loop through all Columns or Rows
          for(var x = 0; x < columnOrRow.length; x++) {
            
            // Update elements attributes
            updateElement(columnOrRow[x], posiblePositions, positive);
            
            // Apply changes to posClasses
            $("."+columnOrRow[x].name)
              .addClass(columnOrRow[x].posClass)
              .removeClass(columnOrRow[x].oldClass);
          }
       }

      function updateElement(columnOrRow, posiblePositions, positive){

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
      }

        var init = function (){
          var track = true;
          var direction;


          var controller = new Leap.Controller();

          controller.on("frame", function(frame){
            if(frame.hands.length > 0){
              var hand = frame.hands[0];
              var translation = hand.translation(controller.frame(10));
              var translationX = translation[0];
              var translationY = translation[1];
              
              var translationThreshold = 100;  //threshold translation
              var velocity = hand.palmVelocity[0];

              // Used only for Canvas
              var speedLevel = (translationX * 800) / translationThreshold;
              drawRectangle(Math.abs(Math.round(speedLevel)));


                  // If hand slows down enough, make it possible to swipe again
                  if(!track && velocity > -20 && velocity < 20 ){
                    track = true;
                    clearCanvas();
                  }

                  // If hand slows a lot, allow to swipe on any direcition
                  if(velocity > -5 && velocity < 5 ){
                    console.log("all directions");
                    direction = "";
                  }

                  // If new swipe is possible, translation is enough and direction correct: swipe
                  if(track) {
                    var horizontal = Math.abs(translationX) > Math.abs(translationY) ? true : false;

                    if(horizontal) {
                      
                      if(translationX < -translationThreshold && direction !== "right") {
                        stepLeft();
                        direction = "left";
                        track = false;
                        animation = true;
                        console.log(direction);
                      }

                      if(translationX > translationThreshold  && direction !== "left") {
                        stepRight();
                        direction = "right";
                        track = false;
                        console.log(direction);
                      }
                     } else {

                      if(translationY < -translationThreshold && direction !== "right") {
                        slide(rows, posibleYPositions, false); // down
                        track = false;
                        console.log(direction);
                      }

                      if(translationY > translationThreshold  && direction !== "left") {
                        slide(rows, posibleYPositions, true); // up
                        direction = "right";
                        track = false;
                        console.log(direction);
                      }

                    }
                  
                  }
                }
              });

              controller.use("handEntry").on("handLost", function() {
                track = true;
                clearCanvas();
              });

              controller.connect();



              function stepLeft() {
                slide(columns, posibleXPositions, false);
              }

              function stepRight() {
                slide(columns, posibleXPositions, true);
              }

              function drawRectangle(width) {
                var green = "#00CC00";
                var yellow = "#FFFF00";

                var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext("2d");
                ctx.clearRect (0, 0, 800, 800);
                ctx.beginPath();
                ctx.rect(0, 780, width, 20, Math.PI * 2, true);

                var gradient = ctx.createLinearGradient(0, 780, width, 20);
                gradient.addColorStop(0, yellow);
                gradient.addColorStop(1, green);

                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#003300";
                ctx.stroke();
              }

              function clearCanvas(){
                var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext("2d");
                ctx.clearRect (0, 0, 800, 800);
              }
          
          $("body").on("keydown", function(key){
            switch(key.keyCode){
              case 37:
                slide(columns, posibleXPositions, false); // left
                break;
              case 38:
                slide(rows, posibleYPositions, true); // up
                break;
              case 39:
                slide(columns, posibleXPositions, true); // right
                break;
              case 40:
                slide(rows, posibleYPositions, false); // down
                break;
            }
          });
        };

        init();
    };

})(window.Caviar);