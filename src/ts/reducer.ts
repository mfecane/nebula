import { getShaderList } from 'ts/shader-registry'

export const initialState = function () {
  const shaderList = getShaderList()
  const id = shaderList[0].id
  return {
    shaderList: shaderList,
    menuVisible: false,
    selectedShader: id,
    error: null,
  }
}

export default (state, action) => {
  console.log('reduce', action)

  switch (action.type) {
    case 'setShader':
      state = { ...state, selectedShader: action.payload }
      break
    case 'toggleMenu':
      state = { ...state, menuVisible: !state.menuVisible }
      break
    case 'setError':
      state = { ...state, error: action.payload }
      break
  }

  console.log('state', state)
  return state
}
