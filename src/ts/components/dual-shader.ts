import Shader from 'ts/webgl/shader'
import Texture from 'ts/webgl/texture'

import {
  init as initControls,
  getValue as getControlValue,
} from 'ts/components/controls'

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

let fpsHistory = []
let fps
let fpsTime = Date.now()

let environmentShader: Shader
let texture: Texture = null
let textureWidth = 4048
let textureHeight = 4048
let frameBuffer: WebGLBuffer

const calculateMVP = function (width, height) {
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

const createSquarePositions = function () {
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  // prettier-ignore
  const positions = [
      -1.0, -1.0,
       1.0, -1.0,
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
}

const drawImage = function (): void {
  nebulaShader.useProgram()
  nebulaShader.setUniform('u_MVP', proj)
  const [mouseX, mouseY, scrollValue] = getMouseControl()
  time = (Date.now() - startTime) / 1000

  gl.activeTexture(gl.TEXTURE1)
  gl.bindTexture(gl.TEXTURE_2D, texture.texture)
  nebulaShader.setUniform('u_Sampler', 1)

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

const renderSkyTexture = function (options): void {

  environmentShader = new Shader(gl)
  environmentShader.createProgram(
    options.bgVert,
    options.bgFrag
  )
  environmentShader.setPositions('aPos')
  environmentShader.addUniform('u_MVP', '4fv')

  texture = new Texture(gl)
  texture.empty(textureWidth, textureHeight)

  frameBuffer = gl.createFramebuffer()
  gl.viewport(0, 0, textureWidth, textureHeight)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture.texture)

  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture.texture,
    0
  )

  canvas.width = textureHeight
  canvas.height = textureWidth

  // gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
  // gl.activeTexture(gl.TEXTURE0)
  // gl.bindTexture(gl.TEXTURE_2D, texture.texture)
  // gl.framebufferTexture2D(
  //   gl.FRAMEBUFFER,
  //   gl.COLOR_ATTACHMENT0,
  //   gl.TEXTURE_2D,
  //   texture.texture,
  //   0
  // )

  calculateMVP(textureWidth, textureHeight)
  environmentShader.useProgram()
  environmentShader.setUniform('u_MVP', proj)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, null)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)
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

const calcFps = function() {
  let now = Date.now()
  if (now === fpsTime) {
    return
  }
  fpsHistory.push(1000.0 / (now - fpsTime))
  fpsTime = now
  if (fpsHistory.length < 10) {
    return
  }
  fps = Math.floor(fpsHistory.reduce((acc, cur) => {
    return (acc + cur) / 2
  }) * 100) / 100
  window.fps.innerHTML = fps
  fpsHistory.unshift();
}

export const animate = function () {
  calculateMVP(width, height) // drop this call
  drawImage()
  calcFps()

  requestAnimationFrame(animate)
}

export const init = function (root, options) {
  rootElement = root
  canvas = document.createElement(`canvas`)
  root.appendChild(canvas)
  canvas.id = 'canvas'

  gl = canvas.getContext('webgl2')

  createSquarePositions()

  renderSkyTexture(options)
  setCanvasSize()
  window.addEventListener('resize', setCanvasSize)

  orbitControlInit()
  orbitControlAnimate()
  initControls()

  nebulaShader = new Shader(gl)
  nebulaShader.createProgram(
    options.mainVert,
    options.mainFrag
  )

  nebulaShader.useProgram()
  nebulaShader.setPositions('aPos')
  nebulaShader.addUniform('u_Sampler', '1i')
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
