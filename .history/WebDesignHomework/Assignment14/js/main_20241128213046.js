 // Get the canvas element
 var c = document.getElementById("myCanvas");
 var ctx = c.getContext("2d");

 // Function to draw the circles based on current canvas size
 function drawCircles() {
   // Adjust the width of the canvas based on the viewport size
   c.width = window.innerWidth;

   // Set up circle properties
   var numCircles = 5;
   var radius = c.width / 5;  // Dynamically scale the radius based on the canvas width
   var spacing = c.width / 40;  // Set spacing dynamically based on the canvas width

   // Adjust the starting x-position to center the circles in the canvas
   var startX = (c.width - (numCircles * (2 * radius + spacing))) / 2;

   // Clear the canvas to redraw the circles
   ctx.clearRect(0, 0, c.width, c.height);

   // Loop to draw 5 circles
   for (var i = 0; i < numCircles; i++) {
     var x = startX + i * (2 * radius + spacing); // Calculate the x position for each circle
     var y = c.height / 2; // Vertically center the circles on the canvas

     // Draw the circle
     ctx.beginPath();
     ctx.arc(x, y, radius, 0, 2 * Math.PI);
     ctx.stroke();
   }
 }

 // Call the drawCircles function initially
 drawCircles();

 // Re-call the drawCircles function whenever the window is resized
 window.addEventListener('resize', drawCircles);