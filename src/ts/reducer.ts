import { getShaderList } from 'ts/shader-registry'
import { PAGES } from 'ts/pages'

export const initialState = function () {
  const shaderList = getShaderList()
  const id = shaderList[0].id
  return {
    shaderList: shaderList,
    selectedShader: id,
    error: null,
    page: PAGES.PAGE_LIST,
  }
}

export default (state, action) => {
  console.log('reduce', action)
  const { type, payload } = action

  switch (type) {
    case 'setShader':
      state = {
        ...state,
        selectedShader: payload,
        page: PAGES.PAGE_DETAILS,
      }
      break

    case 'setPage':
      state = { ...state, page: payload }
      break

    case 'setError':
      state = { ...state, error: payload }
      break
  }

  console.log('state', state)
  return state
}
