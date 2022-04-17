import React from 'react'
import { ThemeProvider } from 'styled-components'

import theme from 'ts/components/styled/themes'
import SignUp from 'ts/components/auth/sign-up'
import GlobalStyle from 'ts/components/styled/global'

const app = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SignUp />
    </ThemeProvider>
  )
}

export default app
