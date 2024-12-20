function addChangeColorFunction(color, line, index) {
  const button = document.getElementById(color + "-button-" + index);
  button.addEventListener("click", () => {
    button.innerText = "X";
    line.color = color;
    const colorArray =
      color === "Red"
        ? [1.0, 0.0, 0.0, 1.0]
        : line.color === "Blue"
        ? [0.0, 0.0, 1.0, 1.0]
        : [0.0, 1.0, 0.0, 1.0];
    console.log(color);
    addGraph(colorArray, line.points);
    renderGraphs();
    //unselect other colors
    unselectColorsBesides(color, index);
    //set theme inside controls
    setControlTheme(color, index);
  });
  console.log(button);
}

const unselectColorsBesides = (color, index) => {
  if (color != "Red") {
    const button = document.getElementById("Red-button-" + index);
    button.innerText = "";
  }
  if (color != "Green") {
    const button = document.getElementById("Green-button-" + index);
    button.innerText = "";
  }
  if (color != "Blue") {
    const button = document.getElementById("Blue-button-" + index);
    button.innerText = "";
  }
};

const setControlTheme = (color, index) => {
  //set header color
  const header_id = "line-header-" + index;
  const line_name = document.getElementById(header_id).querySelector("h3");
  line_name.style.color = color;
  //set button color
  const button_id = "add-point-button-" + index;
  const button = document.getElementById(button_id);
  button.style.backgroundColor = color;
};
