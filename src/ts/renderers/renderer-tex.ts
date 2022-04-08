import Shader from 'ts/webgl/shader'
import Texture from 'ts/webgl/texture'
import Renderer from 'ts/renderers/renderer-base'
import TextureCube from 'ts/webgl/texture-cube'

export default class RendererTexture extends Renderer {
  texture: Texture = null
  textureCube: TextureCube = null

  init() {
    super.init()

    if (this.options.texture) {
      this.texture = new Texture(this.gl)
      this.texture.fromUrl(this.options.texture.src)
    }

    if (this.options.textureCube) {
      this.textureCube = new TextureCube(this.gl)
      this.textureCube.fromSources(this.options.textureCube.src)
    }
  }

  addUniforms(): void {
    super.addUniforms()

    this.mainShader.addUniform('u_Sampler', '1i')
    this.mainShader.addUniform('u_Sampler2', '1i')
  }

  setUniforms(): void {
    super.setUniforms()

    if (this.options.texture) {
      this.gl.activeTexture(this.gl.TEXTURE0)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture)
      this.mainShader.setUniform('u_Sampler', 0)
    }

    if (this.options.textureCube) {
      this.gl.activeTexture(this.gl.TEXTURE1)
      this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.textureCube.texture)
      this.mainShader.setUniform('u_Sampler2', 1)
    }

    // // TODO ::: should i do this every time?
    // this.gl.activeTexture(this.gl.TEXTURE0)
    // this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture)
    // this.mainShader.setUniform('u_Sampler', 0)
  }
}
