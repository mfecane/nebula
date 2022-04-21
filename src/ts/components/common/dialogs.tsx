import React from 'react'
import useDialog, { DIALOGS } from 'ts/hooks/use-dialog'
import LogIn from 'ts/components/auth/login'
import SignUp from 'ts/components/auth/signup'
import Account from 'ts/components/auth/account'
import Create from 'ts/components/create'

const Dialogs = (): JSX.Element => {
  const { dialog } = useDialog()

  switch (dialog) {
    case DIALOGS.LOGIN:
      return <LogIn />

    case DIALOGS.SIGNUP:
      return <SignUp />

    case DIALOGS.ACCOUNT:
      return <Account />

    case DIALOGS.CREATE:
      return <Create />

    default:
      return null
  }
}

export default Dialogs
