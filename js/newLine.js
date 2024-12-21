const linesContainer = document.getElementById("lines-container");
const linesCounter = document.getElementById("lines-counter");

/*
 *   Line Object Fields:
 *   -  name: String,
 *   -  color: Array,
 *   -  points: Array,
 *   -  toggle: Boolean
 */
var lines = []; // array of line objects on the graph

const colors = ["Red", "Blue", "Green"]; // possible line colors

//function to create a new line
function createNewLine() {
  const newColor = colors[Math.floor(Math.random() * colors.length)];
  while (lines.length > 0 && newColor === lines[lines.length - 1].color) {
    newColor = colors[Math.floor(Math.random() * colors.length)];
  }
  lines.push({
    name: "Line " + (lines.length + 1),
    color: newColor,
    points: [],
    toggle: false,
  });
  linesContainer.insertAdjacentHTML(
    "beforeend",
    getLineHTML(lines[lines.length - 1])
  );
  addToggleFunction(lines[lines.length - 1], lines.length);
  addCreatePointFunction(lines[lines.length - 1], lines.length);
  colors.forEach((color) => {
    addChangeColorFunction(color, lines[lines.length - 1], lines.length);
  });
  linesCounter.innerHTML =
    "You have <b>" + lines.length + "</b> lines on your graph";
  console.log("was a new line created?");
  console.log(lines);
}
// html for line controls
function getLineHTML(line) {
  return [
    '<div class="line" id="line-' + lines.length + '">',
    '  <div class="line-header" id="line-header-' + lines.length + '">',
    '    <h3 style="color:' + line.color + '">',
    "       " + line.name,
    "    </h3>",
    '    <h3 class="line-hover-message" id="message-' + lines.length + '">',
    "       Click to Edit",
    "    </h3>",
    "    <button",
    '    id="collapse-button-' + lines.length + '"',
    "    >",
    "      <svg",
    '      xmlns="http://www.w3.org/2000/svg"',
    '      width="52"',
    '      height="20"',
    '      viewBox="0 0 52 20"',
    '      fill="none"',
    "      >",
    '        <path d="M26 0L51.1147 19.5H0.885263L26 0Z" fill="#8F8F8F" />',
    "      </svg>",
    "    </button>",
    "  </div>",
    '  <h3 id="title"><u>Color:</u></h3>',
    '  <div id="color_selector">',
    '     <button class="color_button"',
    '     id="Red-button-' + lines.length + '"', //red button
    '     style="background-color: red;">',
    "        " + (line.color == "Red" ? "X" : ""),
    "     </button>",
    '     <button class="color_button"',
    '     id="Green-button-' + lines.length + '"', //green button
    '     style="background-color: green;">',
    "        " + (line.color == "Green" ? "X" : ""),
    "     </button>",
    '     <button class="color_button"',
    '     id="Blue-button-' + lines.length + '"', //blue button
    '     style="background-color: blue;">',
    "        " + (line.color == "Blue" ? "X" : ""),
    "     </button>",
    "  </div>",
    "  <div",
    '  class="line-points-container"',
    '  id="line-points-container-' + lines.length + '"',
    "  >",
    '     <div class="points" id="points-' + lines.length + '">',
    '        <h3 id="title"><u>Points:</u></h3>',
    '        <p class="individual-point"',
    '        style="color:darkgrey;"',
    "        >",
    "           Origin: (0, 0)",
    "        </p>",
    "     </div>",
    "     <div",
    '     id="add-point"',
    "     >",
    "       New Point:",
    '       ( <input id="x-input-' + lines.length + '"/> ,',
    '       <input id="y-input-' + lines.length + '"/> )',
    '       <button style="background-color:' + line.color + '"',
    '       id="add-point-button-' + lines.length + '"',
    "       >",
    "         Add Point",
    "       </button>",
    "     </div>",
    "  </div>",
    "</div>",
  ].join("\n");
}

// adds toggle to specified line controls
function addToggleFunction(line, index) {
  try {
    const hover_message_id = "message-" + index;
    const button_id = "collapse-button-" + index;
    const container_id = "line-" + index;
    const header_id = "line-header-" + index;
    const button = document.getElementById(button_id);
    const header = document.getElementById(header_id);
    const container = document.getElementById(container_id);
    const message = document.getElementById(hover_message_id);
    header.addEventListener("click", () => {
      line.toggle = !line.toggle;
      console.log(button_id, " was clicked!", " Toggle set to: ", line.toggle);
      if (line.toggle) {
        button.style.transform = "rotateX(180deg)";
        container.style.height = "fit-content";
        message.innerText = "";
      } else {
        button.style.transform = "";
        container.style.height = "60px";
        message.innerText = "Click to Edit";
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// adds function to create a new point for specified line controls
function addCreatePointFunction(line, index) {
  const container_id = "points-" + index;
  const container = document.getElementById(container_id);
  const button_id = "add-point-button-" + index;
  const button = document.getElementById(button_id);
  const x = document.getElementById("x-input-" + index);
  const y = document.getElementById("y-input-" + index);
  button.addEventListener("click", () => {
    //add point and graph it
    const point = getFixedPoint(Number(x.value), Number(y.value));
    const color =
      line.color === "Red"
        ? [1.0, 0.0, 0.0, 1.0]
        : line.color === "Blue"
        ? [0.0, 0.0, 1.0, 1.0]
        : [0.0, 1.0, 0.0, 1.0];
    line.points.push(point.x, point.y);
    addGraph(color, line.points);
    renderGraphs();
    //render html
    container.insertAdjacentHTML(
      "beforeend",
      '<p  class="individual-point">Point ' +
        line.points.length / 2 +
        ": (" +
        x.value +
        ", " +
        y.value +
        ")</p>"
    );
    x.value = "";
    y.value = "";
  });
}

/*
 * Translates and scales points
 * to fit in webgl format.
 */
console.log(canvas.width);
function getFixedPoint(x, y) {
  const width = canvas.width;
  const height = width;
  //format for webgl
  var new_x = (x / width) * 2 - 1;
  var new_y = (y / height) * 2 - 1;
  //truncate
  new_x += "";
  var end = new_x.length < 4 ? new_x.length : 4;
  console.log(end);
  // new_x = Number(new_x.substring(0, end));
  new_y += "";
  end = new_y.length < 4 ? new_y.length : 4;
  console.log(end);
  // new_y = Number(new_y.substring(0, end));

  return { x: new_x, y: new_y };
}
