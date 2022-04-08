import Shader from 'ts/webgl/shader'
import Texture from 'ts/webgl/texture'
import Renderer from 'ts/renderers/renderer-base'

export default class RendererTexture extends Renderer {
  texture: Texture = null

  init() {
    super.init()

    if (this.options.texture) {
      this.texture = new Texture(this.gl)
      this.texture.fromUrl(this.options.texture.src)
    }
  }

  addUniforms(): void {
    super.addUniforms()

    this.mainShader.addUniform('u_Sampler', '1i')
  }

  setUniforms(): void {
    super.setUniforms()

    if (this.options.texture) {
      this.gl.activeTexture(this.gl.TEXTURE0)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture)
    }

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture)
    this.mainShader.setUniform('u_Sampler', 0)
  }
}
