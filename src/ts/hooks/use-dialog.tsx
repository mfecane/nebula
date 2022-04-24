import React, { createContext, useContext, useState } from 'react'

// TODO for future use

export enum DIALOGS {
  'LOGIN',
  'SIGNUP',
  'ACCOUNT',
  'FORGOT',
  'CREATE',
}

const Context = createContext(null)

const useDialog = (): {
  dialog: DIALOGS
  setDialog: React.Dispatch<React.SetStateAction<DIALOGS>>
} => {
  return useContext(Context)
}

export const DialogProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const [dialog, setDialog] = useState<DIALOGS>(null)

  const value = { dialog, setDialog }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default useDialog
