// const defaultUniforms = ['u_time']

// export class ShaderCode {
//   uniforms = []

//   renderer = null

//   constructor(code) {
//     if (!code || !(typeof code === 'string')) throw new Error('Invalid code')
//   }

//   parseTokens(renderer: RendererCode, fragmentSource: string) {
//     const tokens = fragmentSource.match(/[\w_]+/g)
//     console.log(tokens)

//     tokens.forEach((tok) => {
//       // if (tok.startsWith('u_cubetex_')) {
//       //   renderer.addCubemap(tok)
//       // }

//       // if (tok.startsWith('u_tex_')) {
//       //   renderer.addTexture(tok)
//       // }

//       if (tok.startsWith('u_')) {
//         if (!defaultUniforms.includes(tok)) {
//           this.uniforms.push(tok)
//         }
//       }
//     })
//   }

//   setUniform(uniform, value) {
//     this.createRenderer.setuniform(uniform, value)
//   }

//   createRenderer() {

//   }
// }
