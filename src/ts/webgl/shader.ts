interface Uniform {
  type: string
  name: string
  uniform: WebGLUniformLocation | null
}

export default class Shader {
  gl: WebGL2RenderingContext
  uniforms: Uniform[] = []
  positionLocation: GLint | null = null
  program: WebGLProgram | null = null

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
  }

  createProgram(vertexSource: string, fragmentSource: string): void {
    const gl = this.gl
    const vertShader = gl.createShader(gl.VERTEX_SHADER)
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)

    const vertSrc = gl.shaderSource(vertShader, vertexSource)
    const fragSrc = gl.shaderSource(fragShader, fragmentSource)

    gl.compileShader(vertShader, vertSrc)
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      this.throwError(vertShader, vertexSource, 'vertex')
    }

    gl.compileShader(fragShader, fragSrc)
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      this.throwError(fragShader, fragmentSource, 'fragment')
    }

    const program = gl.createProgram()
    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)

    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.log('Error validating program ', gl.getProgramInfoLog(program))
      return
    }
    this.program = program
  }

  useProgram(): void {
    this.gl.useProgram(this.program)
  }

  addUniform(name, type): void {
    const uniform = this.gl.getUniformLocation(this.program, name)
    const u = {
      name,
      type,
      uniform,
    }
    this.uniforms.push(u)
  }

  setUniform(name: string, ...args): void {
    console.log('name', name)
    const u = this.uniforms.find((u) => u.name === name)
    if (u) {
      switch (u.type) {
        case '4fv':
          this.gl.uniformMatrix4fv(u.uniform, false, args[0])
          return
        case '1f':
          this.gl.uniform1f(u.uniform, args[0])
          return
        case '2f':
          this.gl.uniform2f(u.uniform, args[0], args[1])
          return
        case '4f':
          this.gl.uniform4f(u.uniform, args[0], args[1], args[2], args[3])
          return
        case '1i':
          this.gl.uniform1i(u.uniform, args[0])
          return
      }
    }
  }

  setPositions(name): void {
    this.positionLocation = this.gl.getAttribLocation(this.program, name)
    this.gl.enableVertexAttribArray(this.positionLocation)
    this.gl.vertexAttribPointer(
      this.positionLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    )
  }

  throwError(shader: WebGLShader, source: string, type: string): void {
    const re = RegExp('ERROR:\\s+\\d+:(\\d+)', 'g')
    const error = this.gl.getShaderInfoLog(shader).replace(/\x00/g, '').trim()
    let msg = `Error compiling ${type} shader: \n${error}\non:`
    let res
    const lines = {}
    while ((res = re.exec(error))) {
      if (res && res[1]) {
        const line = parseInt(res[1], 10) - 1
        if (!isNaN(line)) {
          lines[line] = true
        }
      }
    }
    Object.keys(lines).forEach((line) => {
      const lines = source.split('\n')
      if (lines[line]) {
        msg += `\n${line}: ${lines[line].trim()}`
      }
    })
    throw new Error(msg)
  }
}
