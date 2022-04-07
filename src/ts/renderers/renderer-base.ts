import Shader from 'ts/webgl/shader'

import {
  init as orbitControlInit,
  animate as orbitControlAnimate,
  getMouseControl,
} from 'ts/components/orbit-control'

interface rendrerOptions {
  id: number
  vertShaderSrc: string
  fragShaderSrc: string
  parameters: []
}

export default class Renderer {
  width = 0
  height = 0
  vertexSource = ''
  fragmentSource = ''
  root: HTMLDivElement = null
  gl: WebGL2RenderingContext = null
  canvas: HTMLCanvasElement = null
  proj: number[] = null
  options: rendrerOptions = null
  animId: number = null

  startTime = Date.now()
  time = this.startTime

  fpsHistory: number[] = []
  fps = 0.0
  fpsTime = Date.now()

  mainShader: Shader

  parameters = {}

  constructor(root: HTMLDivElement, options: rendrerOptions) {
    this.options = options
    this.root = root
    this.canvas = document.createElement(`canvas`)
    this.root.appendChild(this.canvas)
    this.canvas.id = 'canvas'

    this.gl = this.canvas.getContext('webgl2')

    this.setCanvasSize()

    window.addEventListener('resize', this.setCanvasSize.bind(this))

    orbitControlInit()
    orbitControlAnimate()
  }

  init(): void {
    this.vertexSource = this.options.vertexSource
    this.fragmentSource = this.options.fragmentSource

    this.mainShader = new Shader(this.gl)
    this.mainShader.createProgram(this.vertexSource, this.fragmentSource)

    this.createSquarePositions()

    this.mainShader.useProgram()
    this.mainShader.setPositions('aPos')

    this.mainShader.addUniform('u_MVP', '4fv')
    this.mainShader.addUniform('u_time', '1f')
    this.mainShader.addUniform('u_mouseX', '1f')
    this.mainShader.addUniform('u_mouseY', '1f')
    this.mainShader.addUniform('u_scrollValue', '1f')
    this.mainShader.addUniform('u_quality', '1f')

    this.addUniformParameters()
  }

  addUniformParameters(): void {
    this.options.parameters.forEach((item: { id: string; default: number }) => {
      this.mainShader.addUniform(`u_${item.id}`, '1f')
      this.parameters[item.id] = item.default
    })
  }

  createSquarePositions(): void {
    const vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)

    // prettier-ignore
    const positions = [
        -1.0, -1.0,
         1.0, -1.0,
         1.0,  1.0,
        -1.0,  1.0
      ];
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    )

    const indexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

    // prettier-ignore
    const indices = [
        0, 1, 2,
        2, 3, 0
      ];

    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    )
  }

  destroy(): void {
    this.root.removeChild(this.canvas)
    window.removeEventListener('resize', this.setCanvasSize.bind(this))
    cancelAnimationFrame(this.animId)
  }

  renderFrame(): void {
    this.proj = this.calculateMVP(this.width, this.height)

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.mainShader.useProgram()
    this.mainShader.setUniform('u_MVP', this.proj)
    const [mouseX, mouseY, scrollValue] = getMouseControl()
    this.time = (Date.now() - this.startTime) / 1000
    this.mainShader.setUniform('u_time', this.time)
    this.mainShader.setUniform('u_mouseX', mouseX)
    this.mainShader.setUniform('u_mouseY', mouseY)
    this.mainShader.setUniform('u_scrollValue', scrollValue)
    this.mainShader.setUniform('u_quality', 1.0)

    this.setUniformParameters()

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0)
  }

  setUniformParameters(): void {
    this.options.parameters.forEach(({ id }: { id: string }) => {
      const value = this.parameters[id]
      this.mainShader.setUniform(`u_${id}`, value)
    })
  }

  animate(): void {
    this.renderFrame()
    this.updateFps()
    this.animId = requestAnimationFrame(this.animate.bind(this))
  }

  setCanvasSize(): void {
    this.width = this.root.clientWidth
    this.height = this.root.clientHeight

    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.gl.viewport(0, 0, this.width, this.height)
  }

  calculateMVP(width, height): number[] {
    const left = -width / height
    const right = width / height

    const bottom = -1.0
    const top = 1.0

    const near = -1.0
    const far = 1.0

    // prettier-ignore
    return [
      2 / (right - left),                   0,                 0,  -(right + left) / (right - left),
                       0,  2 / (top - bottom),                 0,  -(top + bottom) / (top - bottom),
                       0,                   0,  2 / (far - near),    -(far + near) /   (far - near),
                       0,                   0,                 0,                                 1,
    ];
  }

  updateFps(): void {
    const now = Date.now()
    if (now === this.fpsTime) {
      return
    }
    this.fpsHistory.push(1000.0 / (now - this.fpsTime))
    this.fpsTime = now
    if (this.fpsHistory.length < 10) {
      return
    }
    this.fps =
      Math.floor(
        this.fpsHistory.reduce((acc, cur) => {
          return (acc + cur) / 2
        }) * 100
      ) / 100
    this.fpsHistory.unshift()
  }
}
