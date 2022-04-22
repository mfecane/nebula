// TODO add tests

import RendererCode from 'ts/renderers/renderer-code'
import vertexSource from 'shaders/nebula.vert'
import fragmentSourceTemplate from 'shaders/shader-template.frag'

const defaultUniforms = ['u_time']
vertexSource as string

interface Options {
  onError: (e?: Error) => void
}

export class CreateRenderer {
  uniforms = []
  renderer: RendererCode
  code: string
  onError: Options['onError'] = () => {}

  constructor(options: Options) {
    this.onError = options.onError
  }

  createRenerer(root: HTMLDivElement, code: string) {
    if (!code || !(typeof code === 'string')) throw new Error('Invalid code')
    this.code = code

    this.parseTokens()
    const fragmentSource = this.prepareSource()

    const options = {
      vertexSource,
      fragmentSource,
    }

    try {
      this.renderer = new RendererCode(root, options)
      this.uniforms.forEach((uni) => {
        this.renderer.addUniform(uni)
      })
      this.renderer.init()
    } catch (e) {
      this.onError(e)
      this.renderer.destroy()
      return
    }

    this.renderer.mount()
    this.renderer.animate()

    return this.renderer
  }

  prepareSource() {
    let code = fragmentSourceTemplate as string
    const uniformCoed = this.uniforms
      .map((uni) => `uniform float ${uni};`)
      .join('\n')

    code = code.replace('[uniforms]', uniformCoed)
    code = code.replace('[getColor]', this.code)

    return code
  }

  parseTokens() {
    const tokens = this.code.match(/[\w_]+/g)
    console.log(tokens)

    tokens.forEach((tok) => {
      // if (tok.startsWith('u_cubetex_')) {
      //   renderer.addCubemap(tok)
      // }

      // if (tok.startsWith('u_tex_')) {
      //   renderer.addTexture(tok)
      // }

      if (tok.startsWith('u_')) {
        if (!defaultUniforms.includes(tok)) {
          this.uniforms.push(tok)
        }
      }
    })
  }

  destroy() {
    this.renderer.destroy()
  }
}

// export class ShaderCode {
//   fragmentSource: string
//   uniforms: string[] = []
//   textures: string[] = []
//   cubemaps: string[] = []

//   addUniform(token: string): void {
//     this.uniforms.push(token)
//   }

//   addCubemap(token: string): void {
//     if (this.textures.length > 2) {
//       throw new Error('Too many textures')
//     }

//     this.textures.push(token)
//   }

//   addTexture(token: string): void {
//     if (this.cubemaps.length > 2) {
//       throw new Error('Too many textures')
//     }

//     this.textures.push(token)
//   }
// }
