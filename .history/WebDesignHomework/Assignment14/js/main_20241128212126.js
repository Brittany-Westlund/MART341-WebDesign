var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  // Set up circle properties
  var numCircles = 5;
  var radius = 10;
  var spacing = 0;
  var startX = (c.width - (numCircles * (2 * radius + spacing))) / 2; // Center the circles

  // Loop to draw 5 circles
  for (var i = 0; i < numCircles; i++) {
    var x = startX + i * (2 * radius + spacing); // Calculate the x position for each circle
    var y = c.height / 2; // Vertically center the circles on the canvas

    // Draw the circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }