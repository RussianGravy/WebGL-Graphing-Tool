// user input variabls
var step_size = 70;
var line_width = 10;

// edit step_size
const stepInput = document.getElementById("step-size-input");
stepInput.addEventListener("change", (e) => {
  step_size = Number(e.target.value);
  drawGraph();
  renderGraphs();
});

//edit line_width
const widthInput = document.getElementById("line-width-input");
widthInput.addEventListener("change", (e) => {
  line_width = Number(e.target.value);
  drawGraph();
  renderGraphs();
});
