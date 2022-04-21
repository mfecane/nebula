import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from 'ts/firebase'

export const AuthContext = createContext(undefined)

const useAuth = (): Context => {
  return useContext(AuthContext)
}

interface Context {
  currentUser: User
  signup: (email: string, password: string) => Promise<UserCredential>
  login: (email: string, password: string) => Promise<UserCredential>
  signout: () => Promise<void>
  forgot: (email: string) => Promise<void>
}

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User>(null)

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const userid = userCredential.user.uid
    await setDoc(doc(collection(db, 'users'), userid), {
      name: '',
    })
    return userCredential
  }

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signout = () => {
    return signOut(auth)
  }

  const forgot = (email: string) => {
    return sendPasswordResetEmail(auth, email)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const context: Context = {
    currentUser,
    signup,
    login,
    signout,
    forgot,
  }

  return (
    <AuthContext.Provider value={context}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default useAuth
