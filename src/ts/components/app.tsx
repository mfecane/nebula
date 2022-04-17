import React from 'react'
import { ThemeProvider } from 'styled-components'

import theme from 'ts/components/styled/theme'
import SignUp from 'ts/components/auth/sign-up'
import GlobalStyle from 'ts/components/styled/global'
import { AuthProvider } from 'ts/contexts/auth-context'

const app = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <GlobalStyle />
        <SignUp />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default app
