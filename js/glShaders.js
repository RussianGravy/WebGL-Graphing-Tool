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
uniform vec2 uResolution;

void main() {
    vec2 clipSpace = (aPosition / uResolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, 1), 0.0, 1.0); // Flip Y-axis for WebGL coordinates
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

// Uniform locations
const colorLocation = gl.getUniformLocation(program, "uLineColor");
const resolutionLocation = gl.getUniformLocation(program, "uResolution");

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

// Array to store multiple graphs
const graphs = [];

function addGraph(color, points) {
  console.log("fixed points");
  graphs.push({ color, points: [-1, -1, ...points] });
}

function renderGraphs() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (const graph of graphs) {
    // Set the line color
    gl.uniform4f(
      colorLocation,
      graph.color[0],
      graph.color[1],
      graph.color[2],
      graph.color[3]
    );

    // Set resolution
    gl.uniform2f(resolutionLocation, step_size * 20, step_size * 20); // scales to match the step size

    const vertices = [];
    const thickness = line_width * (step_size / 70); // scales to match the step size

    for (let i = 0; i < graph.points.length - 2; i += 2) {
      const x1 = graph.points[i];
      const y1 = graph.points[i + 1];
      const x2 = graph.points[i + 2];
      const y2 = graph.points[i + 3];

      const dx = y2 - y1;
      const dy = x1 - x2;
      const len = Math.sqrt(dx * dx + dy * dy);
      const offsetX = ((dx / len) * thickness) / 2;
      const offsetY = ((dy / len) * thickness) / 2;

      drawCorner(x1, y1, x2, y2, vertices, thickness);

      // Add two triangles for the thick line
      vertices.push(
        x1 - offsetX,
        y1 - offsetY,
        x1 + offsetX,
        y1 + offsetY,
        x2 - offsetX,
        y2 - offsetY,

        x1 + offsetX,
        y1 + offsetY,
        x2 - offsetX,
        y2 - offsetY,
        x2 + offsetX,
        y2 + offsetY
      );
    }

    const vertexData = new Float32Array(vertices);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 2);
  }
}

function drawCorner(x1, y1, x2, y2, vertices, thickness) {
  const startAngle = Math.atan2(y2 - y1, x2 - x1); // Angle of the line
  const radius = thickness / 2; // Radius for semicircles
  const numSegments = 20; // Number of segments for smoothness
  // Generate the semicircle at the start
  for (let i = 0; i < numSegments; i++) {
    const theta1 = startAngle - Math.PI + (Math.PI / numSegments) * i;
    const theta2 = startAngle - Math.PI + (Math.PI / numSegments) * (i + 1);
    const offsetX1 = Math.cos(theta1) * radius;
    const offsetY1 = Math.sin(theta1) * radius;
    const offsetX2 = Math.cos(theta2) * radius;
    const offsetY2 = Math.sin(theta2) * radius;
    // Triangle for the current segment
    vertices.push(x1, y1); // Center of the semicircle
    vertices.push(x1 + offsetX1, y1 + offsetY1); // First point on the perimeter
    vertices.push(x1 + offsetX2, y1 + offsetY2); // Next point on the perimeter
  }
  // Generate the semicircle at the end
  for (let i = 0; i < numSegments; i++) {
    const theta1 = startAngle + (Math.PI / numSegments) * i;
    const theta2 = startAngle + (Math.PI / numSegments) * (i + 1);
    const offsetX1 = Math.cos(theta1) * radius;
    const offsetY1 = Math.sin(theta1) * radius;
    const offsetX2 = Math.cos(theta2) * radius;
    const offsetY2 = Math.sin(theta2) * radius;
    // Triangle for the current segment
    vertices.push(x2, y2); // Center of the semicircle
    vertices.push(x2 + offsetX1, y2 + offsetY1); // First point on the perimeter
    vertices.push(x2 + offsetX2, y2 + offsetY2); // Next point on the perimeter
  }
}

// Example usage
gl.clearColor(1.0, 1.0, 1.0, 1.0);

// Helper functions no longer useful. Handled inside shader.

//fixes all points to webgl format
function fixAllPoints(points) {
  const fixedPoints = [];
  for (var i = 2; i < points.length; i += 2) {
    const fixedPoint = getFixedPoint(points[i], points[i + 1]);
    fixedPoints.push(Number(fixedPoint.x), Number(fixedPoint.y));
  }
  return [-1, -1, ...fixedPoints];
}

// Translates and scales points to fit in webgl format.
function getFixedPoint(x, y) {
  const width = step_size * 20; //canvas.width
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
