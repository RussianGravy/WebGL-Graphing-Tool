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

const spacing = 30;

//draw vertical axis
ctx.beginPath();
ctx.moveTo(spacing, 0);
ctx.lineTo(spacing, canvasHeight - spacing);
ctx.stroke();

//draw horizontal axis
ctx.beginPath();
ctx.moveTo(spacing, canvasHeight - spacing);
ctx.lineTo(canvasWidth, canvasHeight - spacing);
ctx.stroke();

// Draw vertical lines
var y = spacing;
while (y <= canvasHeight - 2 * spacing) {
  ctx.beginPath();
  ctx.moveTo(spacing - 10, y);
  ctx.lineTo(spacing + 10, y);
  ctx.stroke();
  y += spacing;
}

// Draw horizontal lines
var x = 2 * spacing;
while (x <= canvasWidth - spacing) {
  ctx.beginPath();
  ctx.moveTo(x, canvasHeight - spacing - 10);
  ctx.lineTo(x, canvasHeight - spacing + 10);
  ctx.stroke();
  x += spacing;
}

ctx.font = "16px Arial";
ctx.fillText("0", spacing - 10, canvasHeight - 15);
