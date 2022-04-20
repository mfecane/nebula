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
import ShaderList from 'ts/components/shader-list/shader-list'

export const FirestoreContext = createContext(undefined)

const useFirestore = () => {
  return useContext(FirestoreContext)
}

const reducer = (state, action) => {
  console.log('action', action)
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
      }

    case 'ADD_CURRENT_USER_DATA':
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload },
      }

    case 'SET_SHADER_LIST':
      return { ...state, shaderList: action.payload }

    case 'CREATE_SHADER': {
      const newShader = { name: action.payload }
      const shaderList = [...state.shaderList, newShader]

      return {
        ...state,
        shaderList: shaderList,
      }
    }

    default:
      return state
  }
}

export const FirestoreContextProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const { currentUser } = useAuth()
  const [state, dispatch] = useReducer(reducer, {
    currentUser: currentUser,
    shaderList: [],
  })

  const initCurrentUser = () => {
    const read = async () => {
      const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
      if (docSnap.exists()) {
        dispatch({ type: 'ADD_CURRENT_USER_DATA', payload: docSnap.data() })
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
      const shaders = []
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        shaders.push({ ...doc.data(), id: doc.id })
      })

      console.log('shaders', shaders)

      dispatch({
        type: 'SET_SHADER_LIST',
        payload: shaders,
      })
    }
    read()
  }

  useEffect(initCurrentUser, [currentUser])
  useEffect(initShaderList, [])

  const updateCurrentUser = async (data) => {
    await setDoc(doc(db, 'users', currentUser.uid), data)
    dispatch({
      type: 'ADD_CURRENT_USER_DATA',
      payload: data,
    })
  }

  const createShader = async (name) => {
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

  const context = {
    state,
    updateCurrentUser,
    createShader,
  }

  return (
    <FirestoreContext.Provider value={context}>
      {children}
    </FirestoreContext.Provider>
  )
}

export default useFirestore
