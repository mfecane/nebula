interface Sources {
  posX: string
  negX: string
  posY: string
  negY: string
  posZ: string
  negZ: string
}

export default class TextureCube {
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

  get texture(): WebGLTexture {
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

  fromSources(sources: Sources): WebGLTexture {
    const gl = this.gl

    this._texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._texture)

    const faceInfos = this.getFaceInfos()
    const promises = []

    faceInfos.forEach(({ target, key }) => {
      // gl.texImage2D(
      //   target,
      //   this.level,
      //   this.internalFormat,
      //   this.format,
      //   this.type,
      //   ctx.canvas
      // )
      gl.texImage2D(
        target,
        this.level,
        this.internalFormat,
        this.width,
        this.height,
        this.border,
        this.srcFormat,
        this.srcType,
        this.pixel
      )

      promises.push(this.loadImage(sources[key], target))
    })

    Promise.all(promises).then((images) => {
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._texture)

      images.forEach(({ image, target }) => {
        gl.texImage2D(
          target,
          this.level,
          this.internalFormat,
          this.width,
          this.height,
          this.border,
          this.srcFormat,
          this.srcType,
          image
        )
      })

      gl.generateMipmap(gl.TEXTURE_CUBE_MAP)

      gl.texParameteri(
        gl.TEXTURE_CUBE_MAP,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      )
    })

    return this._texture
  }

  loadImage(src, target) {
    return new Promise((resolve) => {
      const image = new Image()
      image.onload = () => {
        this.width = image.width
        this.height = image.height

        resolve({ image: image, target: target })
      }
      image.src = src
    })
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

  getFaceInfos(): {
    target: number
    key: string
  }[] {
    return [
      {
        target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        key: 'posX',
      },
      {
        target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        key: 'negX',
      },
      {
        target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        key: 'posY',
      },
      {
        target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        key: 'negY',
      },
      {
        target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        key: 'posZ',
      },
      {
        target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        key: 'negZ',
      },
    ]
  }
}
