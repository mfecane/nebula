import Shader from 'ts/webgl/shader'

import { init as initControls, getValue as getControlValue } from 'ts/components/controls'

import {
  init as orbitControlInit,
  animate as orbitControlAnimate,
  getMouseControl,
} from 'ts/components/orbit-control'

let canvas: HTMLCanvasElement
let rootElement: HTMLDivElement
let gl: WebGL2RenderingContext = null
let width = 0
let height = 0
let nebulaShader: Shader
let proj
let startTime = Date.now()
let time = startTime

const calculateMVP = function () {
  const left = -width / height
  const right = width / height

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
  const [mouseX, mouseY, scrollValue] = getMouseControl()
  time = (Date.now() - startTime) / 1000
  // console.log('time', time)
  nebulaShader.setUniform('u_time', time)
  nebulaShader.setUniform('u_mouseX', mouseX)
  nebulaShader.setUniform('u_mouseY', mouseY)
  nebulaShader.setUniform('u_scrollValue', scrollValue)
  nebulaShader.setUniform('u_control1', getControlValue(1) / 100)
  nebulaShader.setUniform('u_control2', getControlValue(2) / 100)
  nebulaShader.setUniform('u_control3', getControlValue(3) / 100)
  nebulaShader.setUniform('u_control4', getControlValue(4) / 100)
  nebulaShader.setUniform('u_control5', getControlValue(5) / 100)
  nebulaShader.setUniform('u_control6', getControlValue(6) / 100)
  nebulaShader.setUniform('u_control7', getControlValue(7) / 100)
  nebulaShader.setUniform('u_control8', getControlValue(8) / 100)

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

export const animate = function () {
  calculateMVP()
  drawImage()
  requestAnimationFrame(animate)
}

export const init = function (root, vertShaderSrc, fragShaderSrc) {
  rootElement = root
  canvas = document.createElement(`canvas`)
  root.appendChild(canvas)
  canvas.id = 'canvas'

  gl = canvas.getContext('webgl2')

  setCanvasSize()

  window.addEventListener('resize', setCanvasSize)
  orbitControlInit()
  orbitControlAnimate()
  initControls()

  nebulaShader = new Shader(gl)
  nebulaShader.createProgram(
    vertShaderSrc,
    fragShaderSrc
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
  nebulaShader.addUniform('u_time', '1f')
  nebulaShader.addUniform('u_mouseX', '1f')
  nebulaShader.addUniform('u_mouseY', '1f')
  nebulaShader.addUniform('u_scrollValue', '1f')
  nebulaShader.addUniform('u_control1', '1f')
  nebulaShader.addUniform('u_control2', '1f')
  nebulaShader.addUniform('u_control3', '1f')
  nebulaShader.addUniform('u_control4', '1f')
  nebulaShader.addUniform('u_control5', '1f')
  nebulaShader.addUniform('u_control6', '1f')
  nebulaShader.addUniform('u_control7', '1f')
  nebulaShader.addUniform('u_control8', '1f')

  // Create and bind the framebuffer
  // frameBuffer = gl.createFramebuffer()
  // gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
}
