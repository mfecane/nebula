import getShaderList from 'shader-registry'

export const intialState = function () {
  return { shaderList: getShaderList() }
}

export default (state, action) => {}
