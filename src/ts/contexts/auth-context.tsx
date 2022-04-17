import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from 'ts/firebase'

export const AuthContext = createContext(undefined)

export const useAuth = (): Context => {
  return useContext(AuthContext)
}

interface Context {
  currentUser: User
  signup: (email: string, password: string) => Promise<any>
}

export const AuthProvider = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User>(null)

  const signup = (email: string, password: string): Promise<any> => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User) => {
      // TODO check
      setLoading(false)
      setCurrentUser(user)
    })

    return unsubscribe
  }, [])

  const context: Context = {
    currentUser,
    signup,
  }

  return (
    <AuthContext.Provider value={context}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
