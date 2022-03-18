import Shader from 'ts/webgl/shader'

import nebulaVertexShaderSource from 'shaders/nebula.vert'
import nebulaFragmentShaderSource from 'shaders/nebula.frag'

let canvas: HTMLCanvasElement
let rootElement: HTMLDivElement
let gl: WebGL2RenderingContext = null
let width = 0
let height = 0
let nebulaShader: Shader
let proj
let mouseDown
let mouseXprev = 0
let mouseYprev = 0
let mouseX = 0
let mouseY = 0
let speedX = 0
let speedY = 0

const calculateMVP = function () {
  const left = -width/height
  const right = width/height

  const bottom = -1.0
  const top = 1.0

  const near = -1.0
  const far = 1.0

  // prettier-ignore
  proj = [
    2 / (right - left),                   0,                 0,  -(right + left) / (right - left),
                     0,  2 / (top - bottom),                 0,  -(top + bottom) / (top - bottom),
                     0,                   0,  2 / (far - near),      -(far + near) / (far - near),
                     0,                   0,                 0,                                 1,
  ];
}

const drawImage = function (): void {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  nebulaShader.useProgram()
  nebulaShader.setUniform('u_MVP', proj)
  nebulaShader.setUniform('u_mouseX', mouseX)
  nebulaShader.setUniform('u_mouseY', mouseY)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
}

const setCanvasSize = function (): void {
  width = rootElement.clientWidth
  height = rootElement.clientHeight
  canvas.width = width
  canvas.height = height
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  gl.viewport(0, 0, width, height)
}

const updateSpeed = function(speed) {
  if (Math.abs(speed) > 0.1) {
    return speed *= 0.97
  }
  return 0;
}

const handleMouse = function() {
  if (!mouseDown){
    speedX = updateSpeed(speedX)
    speedY = updateSpeed(speedY)
  }

  mouseX += speedX
  mouseY += speedY

  if (mouseX < -2000) mouseX = -2000
  if (mouseX > 2000) mouseX = 2000

  if (mouseY < -2000) mouseY = -2000
  if (mouseY > 2000) mouseY = 2000
}

const handleMouseDown = function(e) {
  mouseDown = true
  mouseXprev = e.screenX
  mouseYprev = e.screenY
}

const handleMouseUp = function(e) {
  mouseDown = false
}

const handleMouseMove = function(e) {
  if (mouseDown) {
    speedX += (e.screenX - mouseXprev) * 0.01
    speedY += (e.screenY - mouseYprev) * 0.01

    mouseXprev = e.screenX
    mouseYprev = e.screenY
  }
}

export const animate = function () {
  handleMouse()
  calculateMVP()
  drawImage()
  requestAnimationFrame(animate)
}

export const init = function (root) {
  rootElement = root
  canvas = document.createElement(`canvas`)
  root.appendChild(canvas)
  canvas.id = 'canvas'

  gl = canvas.getContext('webgl2')

  setCanvasSize()

  window.addEventListener('resize', setCanvasSize)
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);

  nebulaShader = new Shader(gl)
  nebulaShader.createProgram(
    nebulaVertexShaderSource,
    nebulaFragmentShaderSource
  )

  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  // prettier-ignore
  const positions = [
      -1.0,  -1.0,
      1.0,  -1.0,
      1.0,  1.0,
      -1.0,  1.0
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  // prettier-ignore
  const indices = [
      0, 1, 2,
      2, 3, 0
    ];

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  )

  nebulaShader.useProgram()
  nebulaShader.setPositions('aPos')
  nebulaShader.addUniform('u_MVP', '4fv')
  nebulaShader.addUniform('u_mouseX', '1f')
  nebulaShader.addUniform('u_mouseY', '1f')

  // Create and bind the framebuffer
  // frameBuffer = gl.createFramebuffer()
  // gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
}
