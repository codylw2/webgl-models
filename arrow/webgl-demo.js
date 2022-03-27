var cubeRotation = 0.0;

main();

//
// Start here
//
function main() {

  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute float v_Texture_coordinate;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying mediump vec2 vTextureCoord;
    uniform float max_t;
    uniform float min_t;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = vec2((v_Texture_coordinate-min_t)/(max_t-min_t), 0.5);
    }
  `;

  // Fragment shader program
  const fsSource = `
    precision mediump int;
    precision mediump float;

    varying mediump vec2 vTextureCoord;
    uniform sampler2D uSampler;
    
    //-------------------------------------------------
    uniform vec2 u_rampSize;
    uniform float u_linearAdjust;
    //-------------------------------------------------
    void main() {
      vec2 texelRange = vTextureCoord * (u_rampSize - u_linearAdjust);
      vec2 rampUV = (texelRange + 0.5 * u_linearAdjust) / u_rampSize;
      gl_FragColor = texture2D(uSampler, rampUV);
    }
  `;

  // const positions = [0.06, 0.0, 0.0, 0.05196152422706631, 0.03, 0.0, 0.03, 0.05196152422706631, 0.0, 0.0, 0.06, 0.0, -0.03, 0.05196152422706631, 0.0, -0.05196152422706631, 0.03, 0.0, -0.06, 0.0, 0.0, -0.05196152422706631, -0.03, 0.0, -0.03, -0.05196152422706631, 0.0, 0.0, -0.06, 0.0, 0.03, -0.05196152422706631, 0.0, 0.05196152422706631, -0.03, 0.0, 0.06, 0.0, 0.4, 0.05196152422706631, 0.03, 0.4, 0.03, 0.05196152422706631, 0.4, 0.0, 0.06, 0.4, -0.03, 0.05196152422706631, 0.4, -0.05196152422706631, 0.03, 0.4, -0.06, 0.0, 0.4, -0.05196152422706631, -0.03, 0.4, -0.03, -0.05196152422706631, 0.4, 0.0, -0.06, 0.4, 0.03, -0.05196152422706631, 0.4, 0.05196152422706631, -0.03, 0.4, 0.06, 0.0, 0.8, 0.05196152422706631, 0.03, 0.8, 0.03, 0.05196152422706631, 0.8, 0.0, 0.06, 0.8, -0.03, 0.05196152422706631, 0.8, -0.05196152422706631, 0.03, 0.8, -0.06, 0.0, 0.8, -0.05196152422706631, -0.03, 0.8, -0.03, -0.05196152422706631, 0.8, 0.0, -0.06, 0.8, 0.03, -0.05196152422706631, 0.8, 0.05196152422706631, -0.03, 0.8, 0.06, 0.0, 1.2, 0.05196152422706631, 0.03, 1.2, 0.03, 0.05196152422706631, 1.2, 0.0, 0.06, 1.2, -0.03, 0.05196152422706631, 1.2, -0.05196152422706631, 0.03, 1.2, -0.06, 0.0, 1.2, -0.05196152422706631, -0.03, 1.2, -0.03, -0.05196152422706631, 1.2, 0.0, -0.06, 1.2, 0.03, -0.05196152422706631, 1.2, 0.05196152422706631, -0.03, 1.2, 0.06, 0.0, 1.6, 0.05196152422706631, 0.03, 1.6, 0.03, 0.05196152422706631, 1.6, 0.0, 0.06, 1.6, -0.03, 0.05196152422706631, 1.6, -0.05196152422706631, 0.03, 1.6, -0.06, 0.0, 1.6, -0.05196152422706631, -0.03, 1.6, -0.03, -0.05196152422706631, 1.6, 0.0, -0.06, 1.6, 0.03, -0.05196152422706631, 1.6, 0.05196152422706631, -0.03, 1.6, 0.2, 0.0, 1.6, 0.17320508075688773, 0.1, 1.6, 0.1, 0.17320508075688773, 1.6, 0.0, 0.2, 1.6, -0.1, 0.17320508075688773, 1.6, -0.17320508075688773, 0.1, 1.6, -0.2, 0.0, 1.6, -0.17320508075688773, -0.1, 1.6, -0.1, -0.17320508075688773, 1.6, 0.0, -0.2, 1.6, 0.1, -0.17320508075688773, 1.6, 0.17320508075688773, -0.1, 1.6, 0.0, 0.0, 2.0];
  // const indices = [0, 1, 12, 1, 13, 12, 1, 2, 13, 2, 14, 13, 2, 3, 14, 3, 15, 14, 3, 4, 15, 4, 16, 15, 4, 5, 16, 5, 17, 16, 5, 6, 17, 6, 18, 17, 6, 7, 18, 7, 19, 18, 7, 8, 19, 8, 20, 19, 8, 9, 20, 9, 21, 20, 9, 10, 21, 10, 22, 21, 10, 11, 22, 11, 23, 22, 11, 0, 23, 0, 12, 23, 12, 13, 24, 13, 25, 24, 13, 14, 25, 14, 26, 25, 14, 15, 26, 15, 27, 26, 15, 16, 27, 16, 28, 27, 16, 17, 28, 17, 29, 28, 17, 18, 29, 18, 30, 29, 18, 19, 30, 19, 31, 30, 19, 20, 31, 20, 32, 31, 20, 21, 32, 21, 33, 32, 21, 22, 33, 22, 34, 33, 22, 23, 34, 23, 35, 34, 23, 12, 35, 12, 24, 35, 24, 25, 36, 25, 37, 36, 25, 26, 37, 26, 38, 37, 26, 27, 38, 27, 39, 38, 27, 28, 39, 28, 40, 39, 28, 29, 40, 29, 41, 40, 29, 30, 41, 30, 42, 41, 30, 31, 42, 31, 43, 42, 31, 32, 43, 32, 44, 43, 32, 33, 44, 33, 45, 44, 33, 34, 45, 34, 46, 45, 34, 35, 46, 35, 47, 46, 35, 24, 47, 24, 36, 47, 36, 37, 48, 37, 49, 48, 37, 38, 49, 38, 50, 49, 38, 39, 50, 39, 51, 50, 39, 40, 51, 40, 52, 51, 40, 41, 52, 41, 53, 52, 41, 42, 53, 42, 54, 53, 42, 43, 54, 43, 55, 54, 43, 44, 55, 44, 56, 55, 44, 45, 56, 45, 57, 56, 45, 46, 57, 46, 58, 57, 46, 47, 58, 47, 59, 58, 47, 36, 59, 36, 48, 59, 48, 49, 60, 49, 61, 60, 49, 50, 61, 50, 62, 61, 50, 51, 62, 51, 63, 62, 51, 52, 63, 52, 64, 63, 52, 53, 64, 53, 65, 64, 53, 54, 65, 54, 66, 65, 54, 55, 66, 55, 67, 66, 55, 56, 67, 56, 68, 67, 56, 57, 68, 57, 69, 68, 57, 58, 69, 58, 70, 69, 58, 59, 70, 59, 71, 70, 59, 48, 71, 48, 60, 71, 60, 61, 72, 61, 62, 72, 62, 63, 72, 63, 64, 72, 64, 65, 72, 65, 66, 72, 66, 67, 72, 67, 68, 72, 68, 69, 72, 69, 70, 72, 70, 71, 72, 71, 60, 72];
  // let textureCoordinates = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.0];


  const positions = [0.03, 0.0, 0.0, 0.025980762113533156, 0.015, 0.0, 0.015, 0.025980762113533156, 0.0, 0.0, 0.03, 0.0, -0.015, 0.025980762113533156, 0.0, -0.025980762113533156, 0.015, 0.0, -0.03, 0.0, 0.0, -0.025980762113533156, -0.015, 0.0, -0.015, -0.025980762113533156, 0.0, 0.0, -0.03, 0.0, 0.015, -0.025980762113533156, 0.0, 0.025980762113533156, -0.015, 0.0, 0.03, 0.0, 0.2, 0.025980762113533156, 0.015, 0.2, 0.015, 0.025980762113533156, 0.2, 0.0, 0.03, 0.2, -0.015, 0.025980762113533156, 0.2, -0.025980762113533156, 0.015, 0.2, -0.03, 0.0, 0.2, -0.025980762113533156, -0.015, 0.2, -0.015, -0.025980762113533156, 0.2, 0.0, -0.03, 0.2, 0.015, -0.025980762113533156, 0.2, 0.025980762113533156, -0.015, 0.2, 0.03, 0.0, 0.4, 0.025980762113533156, 0.015, 0.4, 0.015, 0.025980762113533156, 0.4, 0.0, 0.03, 0.4, -0.015, 0.025980762113533156, 0.4, -0.025980762113533156, 0.015, 0.4, -0.03, 0.0, 0.4, -0.025980762113533156, -0.015, 0.4, -0.015, -0.025980762113533156, 0.4, 0.0, -0.03, 0.4, 0.015, -0.025980762113533156, 0.4, 0.025980762113533156, -0.015, 0.4, 0.03, 0.0, 0.6, 0.025980762113533156, 0.015, 0.6, 0.015, 0.025980762113533156, 0.6, 0.0, 0.03, 0.6, -0.015, 0.025980762113533156, 0.6, -0.025980762113533156, 0.015, 0.6, -0.03, 0.0, 0.6, -0.025980762113533156, -0.015, 0.6, -0.015, -0.025980762113533156, 0.6, 0.0, -0.03, 0.6, 0.015, -0.025980762113533156, 0.6, 0.025980762113533156, -0.015, 0.6, 0.03, 0.0, 0.8, 0.025980762113533156, 0.015, 0.8, 0.015, 0.025980762113533156, 0.8, 0.0, 0.03, 0.8, -0.015, 0.025980762113533156, 0.8, -0.025980762113533156, 0.015, 0.8, -0.03, 0.0, 0.8, -0.025980762113533156, -0.015, 0.8, -0.015, -0.025980762113533156, 0.8, 0.0, -0.03, 0.8, 0.015, -0.025980762113533156, 0.8, 0.025980762113533156, -0.015, 0.8, 0.1, 0.0, 0.8, 0.08660254037844387, 0.05, 0.8, 0.05, 0.08660254037844387, 0.8, 0.0, 0.1, 0.8, -0.05, 0.08660254037844387, 0.8, -0.08660254037844387, 0.05, 0.8, -0.1, 0.0, 0.8, -0.08660254037844387, -0.05, 0.8, -0.05, -0.08660254037844387, 0.8, 0.0, -0.1, 0.8, 0.05, -0.08660254037844387, 0.8, 0.08660254037844387, -0.05, 0.8, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0];
  const indices = [0, 1, 12, 1, 13, 12, 1, 2, 13, 2, 14, 13, 2, 3, 14, 3, 15, 14, 3, 4, 15, 4, 16, 15, 4, 5, 16, 5, 17, 16, 5, 6, 17, 6, 18, 17, 6, 7, 18, 7, 19, 18, 7, 8, 19, 8, 20, 19, 8, 9, 20, 9, 21, 20, 9, 10, 21, 10, 22, 21, 10, 11, 22, 11, 23, 22, 11, 0, 23, 0, 12, 23, 12, 13, 24, 13, 25, 24, 13, 14, 25, 14, 26, 25, 14, 15, 26, 15, 27, 26, 15, 16, 27, 16, 28, 27, 16, 17, 28, 17, 29, 28, 17, 18, 29, 18, 30, 29, 18, 19, 30, 19, 31, 30, 19, 20, 31, 20, 32, 31, 20, 21, 32, 21, 33, 32, 21, 22, 33, 22, 34, 33, 22, 23, 34, 23, 35, 34, 23, 12, 35, 12, 24, 35, 24, 25, 36, 25, 37, 36, 25, 26, 37, 26, 38, 37, 26, 27, 38, 27, 39, 38, 27, 28, 39, 28, 40, 39, 28, 29, 40, 29, 41, 40, 29, 30, 41, 30, 42, 41, 30, 31, 42, 31, 43, 42, 31, 32, 43, 32, 44, 43, 32, 33, 44, 33, 45, 44, 33, 34, 45, 34, 46, 45, 34, 35, 46, 35, 47, 46, 35, 24, 47, 24, 36, 47, 36, 37, 48, 37, 49, 48, 37, 38, 49, 38, 50, 49, 38, 39, 50, 39, 51, 50, 39, 40, 51, 40, 52, 51, 40, 41, 52, 41, 53, 52, 41, 42, 53, 42, 54, 53, 42, 43, 54, 43, 55, 54, 43, 44, 55, 44, 56, 55, 44, 45, 56, 45, 57, 56, 45, 46, 57, 46, 58, 57, 46, 47, 58, 47, 59, 58, 47, 36, 59, 36, 48, 59, 48, 49, 60, 49, 61, 60, 49, 50, 61, 50, 62, 61, 50, 51, 62, 51, 63, 62, 51, 52, 63, 52, 64, 63, 52, 53, 64, 53, 65, 64, 53, 54, 65, 54, 66, 65, 54, 55, 66, 55, 67, 66, 55, 56, 67, 56, 68, 67, 56, 57, 68, 57, 69, 68, 57, 58, 69, 58, 70, 69, 58, 59, 70, 59, 71, 70, 59, 48, 71, 48, 60, 71, 60, 61, 72, 61, 62, 72, 62, 63, 72, 63, 64, 72, 64, 65, 72, 65, 66, 72, 66, 67, 72, 67, 68, 72, 68, 69, 72, 69, 70, 72, 70, 71, 72, 71, 60, 72, 0, 1, 73, 1, 2, 73, 2, 3, 73, 3, 4, 73, 4, 5, 73, 5, 6, 73, 6, 7, 73, 7, 8, 73, 8, 9, 73, 9, 10, 73, 10, 11, 73, 11, 0, 73];
  let textureCoordinates = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 1.0, 0.0];

  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  var elementsForFormat = {};
  elementsForFormat[gl.LUMINANCE] = 1;
  elementsForFormat[gl.RGB      ] = 3;






  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);













  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
    return null;
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
    return null;
  }

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }








  let vertexPositionAttrib = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  let textureCoordAttrib = gl.getAttribLocation(shaderProgram, 'v_Texture_coordinate');

  let projectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
  let modelViewMatrixUniform = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
  let uSamplerUniform = gl.getUniformLocation(shaderProgram, 'uSampler');
  let rampSizeLocation = gl.getUniformLocation(shaderProgram, "u_rampSize");
  let linearAdjustLocation = gl.getUniformLocation(shaderProgram, "u_linearAdjust");

  let maxLocation = gl.getUniformLocation(shaderProgram, "max_t");
  let minLocation = gl.getUniformLocation(shaderProgram, "min_t");





  let ramp = { name: 'rgb', color: [  1, 1,   1, 1], format: gl.RGB, filter: true, data: [255, 0, 0, 0, 255, 0, 0, 0, 255] }
  const texture = gl.createTexture();
  {
    const {name, format, filter, data} = ramp;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    const width = data.length / elementsForFormat[format];
    gl.texImage2D(
        gl.TEXTURE_2D,     // target
        0,                 // mip level
        format,            // internal format
        width,
        1,                 // height
        0,                 // border
        format,            // format
        gl.UNSIGNED_BYTE,  // type
        new Uint8Array(data));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter ? gl.LINEAR : gl.NEAREST);
    ramp.texture = texture;
    ramp.size = [width, 1];
  }










  let then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;





    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [-0.0, 0.0, -6.0]);  // amount to translate
    mat4.rotate(modelViewMatrix,  // destination matrix
                modelViewMatrix,  // matrix to rotate
                cubeRotation,     // amount to rotate in radians
                [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(modelViewMatrix,  // destination matrix
                modelViewMatrix,  // matrix to rotate
                cubeRotation * .7,// amount to rotate in radians
                [0, 1, 0]);       // axis to rotate around (X)

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(vertexPositionAttrib, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(vertexPositionAttrib);
    }

    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    {
      const numComponents = 1;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      gl.vertexAttribPointer(textureCoordAttrib, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(textureCoordAttrib);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Tell WebGL to use our program when drawing
    gl.useProgram(shaderProgram);

    // Set the shader uniforms
    gl.uniformMatrix4fv(projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(modelViewMatrixUniform, false, modelViewMatrix);




    gl.uniform2fv(rampSizeLocation, ramp.size);
    gl.uniform1f(linearAdjustLocation, 1);


    gl.uniform1f(maxLocation, 1);
    gl.uniform1f(minLocation, 0);


    // Specify the texture to map onto the faces.
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(uSamplerUniform, 0);

    {
      const vertexCount = indices.length;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // Update the rotation for the next draw

    cubeRotation += deltaTime;








    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}




function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
