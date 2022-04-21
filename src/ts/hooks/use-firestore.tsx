import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { db } from 'ts/firebase'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from 'firebase/firestore'
import useAuth from 'ts/hooks/use-auth'

export const FirestoreContext = createContext(undefined)

const useFirestore = () => {
  return useContext(FirestoreContext)
}

interface StateUser {
  email: string
  name?: string
  uid: string
}

interface Shader {
  id: string
  code: string
  user: string
}

interface State {
  shaderList: Shader[]
  userList: StateUser[]
  currentUser: StateUser
  currentShader: Shader
  shaderListLoading: boolean
}

type Action =
  | { type: 'SET_CURRENT_USER'; payload: StateUser }
  | { type: 'ADD_CURRENT_USER_DATA'; payload: StateUser }
  | {
      type: 'SET_SHADER_LIST'
      payload: Shader[]
    }
  | { type: 'ADD_CURRENT_USER_DATA'; payload: StateUser }
  | { type: 'CREATE_SHADER'; payload: Shader }
  | { type: 'SET_CURRENT_SHADER'; payload: string }
  | { type: 'SAVE_CURRENT_SHADER' }
  | { type: 'UPDATE_CURRENT_SHADER'; payload: Shader }
  | { type: 'SET_USER_LIST'; payload: StateUser[] }

const reducer = (state: State, action: Action) => {
  const { type, payload } = action

  switch (type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: payload,
      }

    case 'ADD_CURRENT_USER_DATA':
      return {
        ...state,
        currentUser: { ...state.currentUser, ...payload },
      }

    case 'SET_SHADER_LIST':
      return { ...state, shaderList: payload, shaderListLoading: false }

    case 'SET_USER_LIST':
      return { ...state, userList: payload, shaderListLoading: false }

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
      return { ...state, currentShader: shader }
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
  const [state, dispatch] = useReducer(reducer, {
    shaderList: [],
    shaderListLoading: true,
    currentUser: null,
    currentShader: null,
  })

  const initCurrentUser = () => {
    const read = async () => {
      const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
      if (docSnap.exists()) {
        dispatch({
          type: 'ADD_CURRENT_USER_DATA',
          payload: docSnap.data() as StateUser,
        })
      } else {
        throw new Error('Invalid user')
      }
    }

    if (currentUser) {
      dispatch({
        type: 'SET_CURRENT_USER',
        payload: { email: currentUser.email, uid: currentUser.uid },
      })
      read()
    }
  }

  const initShaderList = () => {
    const read = async () => {
      const q = query(collection(db, 'shaders'))
      const shaders: Shader[] = []
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        shaders.push({ ...(doc.data() as Shader), id: doc.id })
      })

      dispatch({
        type: 'SET_SHADER_LIST',
        payload: shaders,
      })
    }
    read()
  }

  const initUsers = () => {
    const read = async () => {
      const q = query(collection(db, 'users'))
      const users: StateUser[] = []
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        users.push({ ...(doc.data() as StateUser), uid: doc.id })
      })

      dispatch({
        type: 'SET_USER_LIST',
        payload: users,
      })
    }
    read()
  }

  useEffect(initCurrentUser, [currentUser])
  useEffect(initShaderList, [])
  useEffect(initUsers, [])

  const updateCurrentUser = async (data: StateUser) => {
    await setDoc(doc(db, 'users', currentUser.uid), data)
    dispatch({
      type: 'ADD_CURRENT_USER_DATA',
      payload: data,
    })
  }

  const createShader = async (name: string) => {
    if (!currentUser) {
      throw new Error('No user')
    }

    const shader = {
      name: name,
      user: currentUser.uid,
      code: `
vec4 getColor(vec2 inuv) {
  return vec4(vec3(0.5 + inuv.x * 0.5, 0.5 + inuv.y * 0.5, 0.0), 1.0);
}`.trim(),
    }

    const docRef = await addDoc(collection(db, 'shaders'), shader)
    dispatch({
      type: 'CREATE_SHADER',
      payload: { ...shader, id: docRef.id },
    })

    return docRef.id
  }

  const setCurrentShader = (id: string) => {
    dispatch({
      type: 'SET_CURRENT_SHADER',
      payload: id,
    })
  }

  const getShaderById = (id: string) => {
    return state.shaderList.find((el) => el.id === id)
  }

  const updateShader = (data) => {
    dispatch({
      type: 'UPDATE_CURRENT_SHADER',
      payload: data,
    })
  }

  const saveShader = async () => {
    await setDoc(doc(db, 'shaders', state.currentShader.id), {
      ...state.currentShader,
    })
    // check is valid
    dispatch({
      type: 'SAVE_CURRENT_SHADER',
    })
  }

  const context = {
    state,
    updateCurrentUser,
    createShader,
    setCurrentShader,
    getShaderById,
    saveShader,
    updateShader,
  }

  return (
    <FirestoreContext.Provider value={context}>
      {children}
    </FirestoreContext.Provider>
  )
}

export default useFirestore
