import React, { createContext, useContext, useEffect, useReducer } from 'react'
import useAuth from 'ts/hooks/use-auth'
import firestore from 'ts/model/firestore'

export interface UserState {
  email: string
  name?: string
  uid: string
}

export interface ShaderState {
  id?: string
  code: string
  name: string
  user: UserState | string
  error?: boolean
}

interface State {
  shaderList: ShaderState[]
  currentUser: UserState
  currentShader: ShaderState
  shaderListLoading: boolean
  shaderError: Error
}

interface State {
  shaderList: ShaderState[]
}
interface Context {
  state: State
  updateCurrentUser: () => Promise<void>
  createShader: () => Promise<void>
  setCurrentShader: () => Promise<void>
  saveShader: () => Promise<void>
  updateShader: () => Promise<void>
  forkShader: () => Promise<void>
  setShaderError: () => Promise<void>
}

export const FirestoreContext = createContext<Context>(undefined)

const useFirestore = (): Context => {
  return useContext<Context>(FirestoreContext)
}

const initialState: State = {
  shaderList: [],
  shaderListLoading: true,
  currentUser: null,
  currentShader: null,
  shaderError: null,
}

type Action =
  | { type: 'SET_CURRENT_USER'; payload: UserState }
  | { type: 'UPDATE_CURRENT_USER'; payload: UserState }
  | {
      type: 'SET_SHADER_LIST'
      payload: ShaderState[]
    }
  | { type: 'CREATE_SHADER'; payload: ShaderState }
  | { type: 'SET_CURRENT_SHADER'; payload: string }
  | { type: 'SAVE_CURRENT_SHADER'; payload: null }
  | { type: 'UPDATE_CURRENT_SHADER'; payload: ShaderState }
  | { type: 'SET_USER_LIST'; payload: UserState[] }
  | { type: 'SET_SHADER_ERROR'; payload: string }
  | { type: 'FINISH_SHADER_LOADING'; payload?: null }

const reducer = (state: State, action: Action) => {
  const { type, payload } = action

  switch (type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: payload,
      }

    case 'UPDATE_CURRENT_USER':
      return {
        ...state,
        currentUser: payload,
      }

    case 'SET_SHADER_LIST':
      return { ...state, shaderList: payload, shaderListLoading: false }

    case 'CREATE_SHADER': {
      const newShader = { name: payload }
      const shaderList = [...state.shaderList, newShader]

      return {
        ...state,
        shaderList: shaderList,
      }
    }

    case 'SET_CURRENT_SHADER': {
      if (state.currentShader?.id === payload) {
        return state
      }

      const shader = state.shaderList.find((el) => el.id === payload)

      return {
        ...state,
        currentShader: shader,
      }
    }

    case 'SAVE_CURRENT_SHADER': {
      const idx = state.shaderList.findIndex(
        (el) => el.id === state.currentShader.id
      )
      const shaderList = [...state.shaderList]
      shaderList.splice(idx, 1, state.currentShader)

      return {
        ...state,
        shaderList,
      }
    }

    case 'UPDATE_CURRENT_SHADER': {
      const shader = { ...state.currentShader, ...payload }
      return { ...state, currentShader: shader, shaderError: null }
    }

    case 'SET_SHADER_ERROR': {
      return { ...state, shaderError: payload }
    }

    default:
      return state
  }
} // reducer

export const FirestoreContextProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const { currentUser } = useAuth()
  const [state, dispatch] = useReducer(reducer, initialState)

  const initCurrentUser = () => {
    const read = async () => {
      const user = await firestore.readUser(currentUser)
      if (!user) {
        throw new Error('Invalid user')
      }

      dispatch({
        type: 'SET_CURRENT_USER',
        payload: user,
      })
    }

    read()
  }

  const initShaderList = () => {
    const read = async () => {
      const shaders = await firestore.readShaders()
      dispatch({
        type: 'SET_SHADER_LIST',
        payload: shaders,
      })
    }
    read()
  }

  useEffect(initCurrentUser, [currentUser])
  useEffect(initShaderList, [])
  // useEffect(initUsers, [])

  const updateCurrentUser = async (data: UserState) => {
    firestore.saveUser(data, state.currentUser)
    dispatch({
      type: 'UPDATE_CURRENT_USER',
      payload: data,
    })
  }

  const createShader = async (name: string) => {
    const shader = await firestore.createShader(name, currentUser)
    dispatch({
      type: 'CREATE_SHADER',
      payload: shader,
    })
  }

  const setCurrentShader = (id: string) => {
    dispatch({
      type: 'SET_CURRENT_SHADER',
      payload: id,
    })
  }

  const updateShader = (data: ShaderState) => {
    dispatch({
      type: 'UPDATE_CURRENT_SHADER',
      payload: data,
    })
  }

  const saveShader = async () => {
    await firestore.saveShader(state.currentShader, state.currentUser)
    dispatch({
      type: 'SAVE_CURRENT_SHADER',
      payload: null,
    })
  }

  const forkShader = async () => {
    const shader = await firestore.forkShader(state.currentShader, currentUser)

    dispatch({
      type: 'CREATE_SHADER',
      payload: shader,
    })
  }

  const setShaderError = (error: string) => {
    dispatch({
      type: 'SET_SHADER_ERROR',
      payload: error,
    })
  }

  const context = {
    state,
    updateCurrentUser,
    createShader,
    setCurrentShader,
    saveShader,
    updateShader,
    forkShader,
    setShaderError,
  }

  return (
    <FirestoreContext.Provider value={context}>
      {children}
    </FirestoreContext.Provider>
  )
}

export default useFirestore
