export default class Texture {
  _texture: WebGLTexture = null
  gl: WebGL2RenderingContext = null
  level = 0
  internalFormat = 0
  border = 0
  format = 0
  srcFormat = 0
  type = 0
  data = null
  srcType = 0
  pixel: Uint8Array = null
  width = 0
  height = 0
  targetTextureWidth = 0
  targetTextureHeight = 0

  get texture():WebGLTexture {
    return this._texture
  }

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    this.pixel = new Uint8Array([106, 163, 149, 255])
    this.internalFormat = this.gl.RGBA
    this.format = this.gl.RGBA
    this.srcFormat = this.gl.RGBA
    this.type = this.gl.UNSIGNED_BYTE
    this.srcType = this.gl.UNSIGNED_BYTE
  }

  fromUrl(url: string): WebGLTexture {
    const gl = this.gl

    this._texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this._texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      this.level,
      this.internalFormat,
      this.width,
      this.height,
      this.border,
      this.srcFormat,
      this.srcType,
      this.pixel
    )

    const image = new Image()
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, this._texture)
      gl.texImage2D(
        gl.TEXTURE_2D,
        this.level,
        this.internalFormat,
        this.srcFormat,
        this.srcType,
        image
      )

      this.width = image.width
      this.height = image.height

      gl.generateMipmap(gl.TEXTURE_2D)

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      )
    }
    image.src = url

    return this._texture
  }

  empty(targetTextureWidth: number, targetTextureHeight: number): WebGLTexture {
    const gl = this.gl

    this._texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this._texture)

    this.data = null

    this.targetTextureWidth = targetTextureWidth
    this.targetTextureHeight = targetTextureHeight

    gl.texImage2D(
      gl.TEXTURE_2D,
      this.level,
      this.internalFormat,
      this.targetTextureWidth,
      this.targetTextureHeight,
      this.border,
      this.srcFormat,
      this.srcType,
      this.data
    )

    // set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    return this._texture
  }
}
