import React, { createContext, useContext, useReducer } from 'react'
import { getShaderList } from 'ts/shader-registry'

interface State {
  shaderList: any[]
  selectedShader: number
  error?: string
}

interface Action {
  type: string
  payload: any
}

export const initialState = (): State => {
  const shaderList = getShaderList()
  const id = shaderList[0].id

  return {
    shaderList: shaderList,
    selectedShader: id,
    error: null,
  }
}

const reducer = (state: State, action: Action) => {
  console.log('reduce', action)
  const { type, payload } = action

  switch (type) {
    case 'setShader':
      state = {
        ...state,
        selectedShader: payload,
      }
      break

    case 'setError':
      state = { ...state, error: payload }
      break
  }

  console.log('state', state)
  return state
}

const StateContext = createContext(null)

const useGlobalState = (): [state: State, dispatch: React.Dispatch<Action>] => {
  return useContext(StateContext)
}

export const GlobalStateProvider = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState())

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  )
}

export default useGlobalState
