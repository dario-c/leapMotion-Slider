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