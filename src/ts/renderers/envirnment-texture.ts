// not used

import Shader from 'ts/webgl/shader'

import nebulaVertexShaderSource from 'shaders/space-texture/space-texture.vert'
import nebulaFragmentShaderSource from 'shaders/space-texture/space-texture.frag'

import Texture from 'ts/webgl/texture'

let canvas: HTMLCanvasElement
let gl: WebGL2RenderingContext = null
const width = 512
const height = 512
let nebulaShader: Shader
let proj
let texture: Texture
let frameBuffer: WebGLBuffer
let ready = false

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

const createSquarePositions = function (gl) {
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
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture.texture)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture.texture,
    0
  )

  nebulaShader.useProgram()
  nebulaShader.setUniform('u_MVP', proj)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)

  ready = true
}

export const init = function ():Promise<void> {
  return new Promise((resolve, reject) => {
    canvas = document.createElement(`canvas`)
    gl = canvas.getContext('webgl2')

    setCanvasSize()
    calculateMVP()

    nebulaShader = new Shader(gl)
    nebulaShader.createProgram(
      nebulaVertexShaderSource,
      nebulaFragmentShaderSource
    )

    createSquarePositions(gl)

    nebulaShader.useProgram()
    nebulaShader.setPositions('aPos')

    texture = new Texture(gl)
    texture.empty(width, height)

    frameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)

    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture.texture,
      0
    )
    drawImage()

    resolve(null)
  })
}

const setCanvasSize = function (): void {
  canvas.width = width
  canvas.height = height
  gl.viewport(0, 0, width, height)
}

export const getTexture = function (): Texture {
  return texture
}
