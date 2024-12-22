const canvas = document.getElementById("gl-window");
const gl = canvas.getContext("webgl");

// Adjust canvas resolution
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = window.innerWidth * devicePixelRatio * 0.5;
canvas.height = window.innerHeight * devicePixelRatio * 0.5;

gl.viewport(0, 0, canvas.width, canvas.height);

// WebGL resources and shader setup
const vertexShaderSource = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragShaderSource = `
  precision mediump float;
  uniform vec4 uLineColor;
  void main() {
    gl_FragColor = uLineColor;
  }
`;

function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error: ", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error("Shader Compile Error");
  }
  return shader;
}

const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragShaderSource, gl.FRAGMENT_SHADER);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error("Program Link Error: ", gl.getProgramInfoLog(program));
  throw new Error("Program Link Error");
}
gl.useProgram(program);

// Position attribute
const positionLocation = gl.getAttribLocation(program, "aPosition");
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Color uniform
const colorLocation = gl.getUniformLocation(program, "uLineColor");

// Array to store multiple graphs
const graphs = [];

function addGraph(color, points) {
  graphs.push({ color: color, points: [-1, -1, ...points] });
  console.log("All Graphs: ", graphs);
}

function renderGraphs() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  console.log(graphs);
  for (const graph of graphs) {
    // Set the line color
    gl.uniform4f(
      colorLocation,
      graph.color[0],
      graph.color[1],
      graph.color[2],
      graph.color[3]
    );

    // Upload the vertex data
    console.log(graph.points);
    console.log(fixAllPoints(graph.points));
    const vertices = new Float32Array(fixAllPoints(graph.points)); //graph.points
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Draw the graph
    gl.drawArrays(gl.LINE_STRIP, 0, graph.points.length / 2);
  }
}

//fixes all points to webgl format
function fixAllPoints(points) {
  const fixedPoints = [];
  for (var i = 2; i < points.length; i += 2) {
    const fixedPoint = getFixedPoint(points[i], points[i + 1]);
    fixedPoints.push(fixedPoint.x, fixedPoint.y);
  }
  return [-1, -1, ...fixedPoints];
}

// Translates and scales points to fit in webgl format.
console.log(canvas.width);
function getFixedPoint(x, y) {
  const width = step_size * 19; //canvas.width
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

// // Example usage
gl.clearColor(1.0, 1.0, 1.0, 1.0);
// addGraph([1.0, 0.0, 0.0, 1.0], [-0.5, -0.5, 0.5, 0.5]);
// addGraph([0.0, 1.0, 0.0, 1.0], [-0.5, 0.5, 0.5, -0.5]);
// addGraph([0.0, 0.0, 1.0, 1.0], [-0.8, -0.2, 0.8, 0.2]);

// renderGraphs();
