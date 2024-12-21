const canv = document.getElementById("graph-lines");
const ctx = canv.getContext("2d");

canv.width = canv.clientWidth;
canv.height = canv.clientHeight;

const canvasWidth = canv.clientWidth;
const canvasHeight = canvasWidth;

console.log(window.innerWidth, canvasWidth, canvasHeight);

// Line styles
ctx.strokeStyle = "black";
ctx.lineWidth = 1;

ctx.font = "16px Arial";
ctx.textAlign = "center"; // Horizontal alignment
const margin = 50;
const spacing = 30;

//draw vertical axis
ctx.beginPath();
ctx.moveTo(margin, 0);
ctx.lineTo(margin, canvasHeight - margin);
ctx.stroke();

//draw horizontal axis
ctx.beginPath();
ctx.moveTo(margin, canvasHeight - margin);
ctx.lineTo(canvasWidth, canvasHeight - margin);
ctx.stroke();

// Draw vertical lines
var y = canvasHeight - margin - spacing;
var counter = 70; //temp
while (y >= spacing) {
  ctx.beginPath();
  ctx.moveTo(margin - 10, y);
  ctx.lineTo(margin + 10, y);
  ctx.stroke();
  const number = counter; //temp
  ctx.fillText(number, margin - 30, y + 5);
  y -= spacing;
  counter += 70; //temp
}

// Draw horizontal lines
var counter = 70; //temp
var x = margin + spacing;
while (x <= canvasWidth - spacing) {
  ctx.beginPath();
  ctx.moveTo(x, canvasHeight - margin - 10);
  ctx.lineTo(x, canvasHeight - margin + 10);
  ctx.stroke();
  const number = counter; //temp
  drawTextAtAngle(ctx, number, x + 1, canvasHeight - margin + 31, -90);
  //   ctx.fillText(number, x + 2, canvasHeight - margin + 28);
  x += spacing;
  counter += 70; //temp
}

//draw origin
ctx.fillText("0", spacing - 10, canvasHeight - 15);

function drawTextAtAngle(ctx, text, x, y, angle, options = {}) {
  const {
    font = "16px Arial",
    color = "black",
    textAlign = "center",
    textBaseline = "middle",
  } = options;

  ctx.save(); // Save the current state of the canvas

  // Move to the desired position
  ctx.translate(x, y);

  // Rotate the canvas around the new origin
  ctx.rotate((angle * Math.PI) / 180);

  // Set text properties
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;

  // Draw the text (0, 0 is now at the rotated and translated origin)
  ctx.fillText(text, 0, 0);

  ctx.restore(); // Restore the canvas to its original state
}
