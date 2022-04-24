import { FieldValue } from 'firebase/firestore'
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
  updated: FieldValue
}

interface State {
  shaderList: ShaderState[]
  userList: UserState[]
  currentUser: UserState
  currentShader: ShaderState
  shaderListLoading: boolean
  shaderError: Error
  search: string
}

const initialState: State = {
  shaderList: [],
  userList: [],
  shaderListLoading: true,
  currentUser: null,
  currentShader: null,
  shaderError: null,
  search: '',
}

interface Context {
  state: State
  updateCurrentUser: () => Promise<void>
  createShader: () => Promise<ShaderState>
  setCurrentShader: () => Promise<void>
  saveShader: () => Promise<void>
  updateShader: () => Promise<void>
  forkShader: () => Promise<ShaderState>
  setShaderError: () => Promise<void>
  getuserById: (id: string) => UserState
  doSearch: (s: string) => void
}

export const FirestoreContext = createContext<Context>(undefined)

const useStore = (): Context => {
  return useContext<Context>(FirestoreContext)
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
  | { type: 'LOADING_FINISHED'; payload?: null }
  | { type: 'SEARCH'; payload: string }

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
      return { ...state, shaderList: payload }

    case 'SET_USER_LIST':
      return { ...state, userList: payload }

    case 'LOADING_FINISHED':
      return { ...state, shaderListLoading: false }

    case 'CREATE_SHADER': {
      const shader = { ...payload, user: { ...state.currentUser } }
      const shaderList = [...state.shaderList, shader]

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

    case 'SEARCH':
      return { ...state, search: payload }

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
        return
      }
      dispatch({
        type: 'SET_CURRENT_USER',
        payload: user,
      })
    }

    read()
  }

  const initShaderData = () => {
    const read = async () => {
      const [shaders, users] = await firestore.readShaders()
      dispatch({
        type: 'SET_SHADER_LIST',
        payload: shaders,
      })

      dispatch({
        type: 'SET_USER_LIST',
        payload: users,
      })

      dispatch({
        type: 'LOADING_FINISHED',
        payload: null,
      })
    }
    read()
  }

  useEffect(initCurrentUser, [currentUser])
  useEffect(initShaderData, [])

  const updateCurrentUser = async (data: UserState) => {
    firestore.saveUser(data, state.currentUser)
    dispatch({
      type: 'UPDATE_CURRENT_USER',
      payload: data,
    })
  }

  const createShader = async (name: string): Promise<ShaderState> => {
    const shader = await firestore.createShader(name, currentUser)
    dispatch({
      type: 'CREATE_SHADER',
      payload: shader,
    })
    return shader
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

  const forkShader: Context['forkShader'] = async () => {
    const shader = await firestore.forkShader(
      state.currentShader,
      state.currentUser
    )

    dispatch({
      type: 'CREATE_SHADER',
      payload: shader,
    })
    return shader
  }

  const setShaderError = (error: string) => {
    dispatch({
      type: 'SET_SHADER_ERROR',
      payload: error,
    })
  }

  const getuserById = (uid) => {
    if (state.userList) {
      console.error('userList not loaded')
    }
    return (state.userList || []).find((u) => u.uid === uid)
  }

  const doSearch: Context['doSearch'] = (payload) => {
    dispatch({
      type: 'SEARCH',
      payload,
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
    getuserById,
    doSearch,
  }

  return (
    <FirestoreContext.Provider value={context}>
      {!state.shaderListLoading && children}
    </FirestoreContext.Provider>
  )
}

export default useStore
