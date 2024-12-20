const vertexShaderText = [
  "precision mediump float;",
  "attribute vec2 vertPosition;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",
  "void main()",
  "{",
  "  fragColor = vertColor;",
  "  gl_Position = vec4(vertPosition, 0.0, 1.0);",
  "}",
].join("\n");
const fragmentShaderText = [
  "precision mediump float;",
  "varying vec3 fragColor;",
  "void main()",
  "{",
  "  gl_FragColor = vec4(fragColor, 1.0);",
  "}",
].join("\n");

function initDemo() {
  const canvas = document.getElementById("gl-window");
  const gl = canvas.getContext("webgl");
  console.log(
    gl == null ? "Didn't work, webgl not supported." : "you're set bruv"
  );
  gl.clearColor(0.75, 0.95, 0.8, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //
  //create shaders
  //
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      gl.getShaderInfoLog(vertexShader)
    );
    return;
  }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling fragment shader!",
      gl.getShaderInfoLog(fragmentShader)
    );
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program!", gl.getInfoLog(program));
    return;
  }
  gl.validateProgram(program); //only for development
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR validating program!", gl.getInfoLog(program));
    return;
  }
  //
  //create buffer
  //
  var triangleVerts = [
    0.0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0, 0.0,
    1.0,
  ];

  var triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVerts),
    gl.STATIC_DRAW
  );

  var positionAtribLocation = gl.getAttribLocation(program, "vertPosition");
  var colornAtribLocation = gl.getAttribLocation(program, "vertColor");
  gl.vertexAttribPointer(
    positionAtribLocation, //attribute location
    2, //attribute location
    gl.FLOAT, //type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, //size of an individual vertex
    0 // offset from the beginning of a single vertex to this attribute
  );
  gl.vertexAttribPointer(
    colornAtribLocation, //attribute location
    3, //attribute location
    gl.FLOAT, //type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, //size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute
  );

  gl.enableVertexAttribArray(positionAtribLocation);
  gl.enableVertexAttribArray(colornAtribLocation);

  //
  //Main render loop
  //
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}
