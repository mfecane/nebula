import Rendererbase from 'ts/renderers/renderer-base'
import Shader from 'ts/webgl/shader'
import Texture from 'ts/webgl/texture'

import {
  init as orbitControlInit,
  animate as orbitControlAnimate,
  getMouseControl,
} from 'ts/components/orbit-control'

export default class RendererBg extends Rendererbase {
  textureHeight = 4048
  textureWidth = 4048
  texture: Texture
  frameBuffer: WebGLBuffer

  init(): void {
    this.vertexSource = this.options.vertexSource
    this.fragmentSource = this.options.fragmentSource

    this.createSquarePositions()
    this.renderSkyTexture()

    this.mainShader = new Shader(this.gl)
    this.mainShader.createProgram(this.vertexSource, this.fragmentSource)

    this.mainShader.useProgram()
    this.mainShader.setPositions('aPos')

    this.mainShader.addUniform('u_MVP', '4fv')
    this.mainShader.addUniform('u_time', '1f')
    this.mainShader.addUniform('u_mouseX', '1f')
    this.mainShader.addUniform('u_mouseY', '1f')
    this.mainShader.addUniform('u_scrollValue', '1f')
    this.mainShader.addUniform('u_quality', '1f')
    this.mainShader.addUniform('u_Sampler', '1i')

    this.addUniformParameters()
  }

  renderSkyTexture = function (): void {
    this.bgVertexSource = this.options.bgVertexSource
    this.bgFragmentSource = this.options.bgFragmentSource

    this.environmentShader = new Shader(this.gl)
    this.environmentShader.createProgram(
      this.bgVertexSource,
      this.bgFragmentSource
    )
    this.environmentShader.setPositions('aPos')
    this.environmentShader.addUniform('u_MVP', '4fv')
    this.environmentShader.setUniform('u_quality', '1f')
    this.environmentShader.setUniform('u_control4', '1f')

    this.texture = new Texture(this.gl)
    this.texture.empty(this.textureWidth, this.textureHeight)

    this.frameBuffer = this.gl.createFramebuffer()
    this.gl.viewport(0, 0, this.textureWidth, this.textureHeight)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture)

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer)
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      this.texture.texture,
      0
    )

    this.canvas.width = this.textureHeight
    this.canvas.height = this.textureWidth

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

    this.proj = this.calculateMVP(this.width, this.height)
    this.environmentShader.useProgram()
    this.environmentShader.setUniform('u_MVP', this.proj)

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0)
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  renderFrame = function (): void {
    this.proj = this.calculateMVP(this.width, this.height)

    this.mainShader.useProgram()
    this.mainShader.setUniform('u_MVP', this.proj)
    const [mouseX, mouseY, scrollValue] = getMouseControl()
    this.time = (Date.now() - this.startTime) / 1000

    this.gl.activeTexture(this.gl.TEXTURE1)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture)
    this.mainShader.setUniform('u_Sampler', 1)

    this.mainShader.setUniform('u_time', this.time)
    this.mainShader.setUniform('u_mouseX', mouseX)
    this.mainShader.setUniform('u_mouseY', mouseY)
    this.mainShader.setUniform('u_scrollValue', scrollValue)

    this.setUniformParameters()

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0)
  }
}
