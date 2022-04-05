const shaderList = []

const addShader = (sh) => {
  shaderList.push(sh)
}

export const getShaderList = () => {
  return shaderList
}

addShader({
  vertexSource: '',
  fragmentSource: ''
})
