class MyPoint {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

class Circle {
  constructor(radius, pointsPerCirle, move) {
    this.circle = []
    for (let i = 0.0; i < 360.0; i += 360.0 / pointsPerCirle) {
      const x = radius * Math.cos(degrees_to_radians(i));
      const y = radius * Math.sin(degrees_to_radians(i));
      this.circle.push(new MyPoint(move, y, x))
    }
  }
  get points() {
    return this.circle;
  }
}
class HalfCircle {
  constructor(radius, pointsPerHalfCirle) {
    this.halfCircle = []
    for (let i = 0.0; i <= 180.0; i += 180.0 / pointsPerHalfCirle) {
      const x = radius * Math.cos(degrees_to_radians(i));
      const y = radius * Math.sin(degrees_to_radians(i));
      this.halfCircle.push(new MyPoint(y, x, 0));
    }
  }
  get points() {
    return this.halfCircle
  }
}

class Sphere {
  constructor(radius, pointsPerCirle) {
    let halfCircle = new HalfCircle(radius, pointsPerCirle / 2);
    this.circles = []
    for (let i = 0; i < halfCircle.points.length; i++) {
      this.circles.push(new Circle(halfCircle.points[i].x, pointsPerCirle, halfCircle.points[i].y))
    }
    //for (let i = 0; i < halfCircle.points.length; i++) {
    //  this.circles.push(new Circle(halfCircle.points[i].x, pointsPerCirle, -halfCircle.points[i].y))
    //}
  }
  get points() {
    let pts = []
    this.circles.forEach(
      circle => pts = pts.concat(circle.points)
    )
    return pts;
  }
}



let mat4 = glMatrix.mat4
var rotation = 0.0;

let pointsNumber = 0;
main();

let pageX = 0.0;
let pageY = 0.0;

function logMovement(event) {
  pageY += event.movementX / 50.0
  pageX += event.movementY / 50.0
}

document.addEventListener('mousemove', logMovement);
document.addEventListener("touchmove", e => {
  pageX = e.touches[0].pageX / 50;
  pageY = e.touches[0].pageY / 50;
});

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      gl_PointSize = 3.0;
    }
  `;

  // Fragment shader program

  const fsSource = `
    void main() {
      gl_FragColor = vec4(0.1, 0.3, 0.9, 100);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  let halfPoints = 6;
  let buffers = initBuffers(gl, halfPoints);
  document.onkeydown = e => {
    gl.deleteBuffer(buffers.position)
    if (e.key == 'ArrowDown') {
      if (halfPoints > 1) halfPoints--;
    }
    else if (e.key == 'ArrowUp') {
      halfPoints++;
    }
    const buf = initBuffers(gl, halfPoints)
    buffers.position = buf.position
  };

  // Draw the scene
  var then = 0;
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//

function initBuffers(gl, pointsPerHalfCirle) {

  // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.

  const simpleArrayPoints = []
  pointsNumber = 0;
  let sphere = new Sphere(2.0, pointsPerHalfCirle * 2);
  for (let circleI = 0; circleI < sphere.circles.length - 1; circleI++) {
    const circle = sphere.circles[circleI];
    const nextCircle = sphere.circles[circleI + 1]
    for (let circlePointI = 0; circlePointI < circle.points.length - 1; circlePointI++) {
      {
        const thisCirclePoint = circle.points[circlePointI]
        const thisCircleNextPoint = circle.points[circlePointI + 1]
        const nextCirclePoint = nextCircle.points[circlePointI]
        const triangle = [thisCirclePoint, thisCircleNextPoint, nextCirclePoint]
        triangle.forEach(p => simpleArrayPoints.push(p.x, p.y, p.z))
        pointsNumber+=3;
      }
      {
        const thisCircleNextPoint = circle.points[circlePointI + 1]
        const nextCirclePoint = nextCircle.points[circlePointI]
        const nextCircleNextPoint = nextCircle.points[circlePointI + 1]
        const triangle = [thisCircleNextPoint, nextCirclePoint, nextCircleNextPoint]
        triangle.forEach(p => simpleArrayPoints.push(p.x, p.y, p.z))
        pointsNumber+=3;
      }
    }
    {
      const last = circle.points.length - 1
      const thisCirclePoint = circle.points[0]
      const thisCircleNextPoint = circle.points[last]
      const nextCirclePoint = nextCircle.points[0]
      const triangle = [thisCirclePoint, thisCircleNextPoint, nextCirclePoint]
      triangle.forEach(p => simpleArrayPoints.push(p.x, p.y, p.z))
      pointsNumber+=3;
    }
    {
      const last = circle.points.length - 1;
      const thisCircleNextPoint = circle.points[last]
      const nextCirclePoint = nextCircle.points[last]
      const nextCircleNextPoint = nextCircle.points[0]
      const triangle = [thisCircleNextPoint, nextCirclePoint, nextCircleNextPoint]
      triangle.forEach(p => simpleArrayPoints.push(p.x, p.y, p.z))
      pointsNumber+=3;
    }
  }
  //pointsNumber;


  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(simpleArrayPoints),
    gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, deltaTime) {
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
    -pageX,     // amount to rotate in radians
    [1, 0, 0]);       // axis to rotate around (Z)
  mat4.rotate(modelViewMatrix,  // destination matrix
    modelViewMatrix,  // matrix to rotate
    pageY,// amount to rotate in radians
    [0, 1, 0]);       // axis to rotate around (X)

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix);

  {
    const offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, pointsNumber);
  }
  rotation += deltaTime;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

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

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
