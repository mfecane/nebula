import React from 'react'
import { GlobalStateProvider } from 'ts/contexts/state-context'
import { ThemeProvider } from 'styled-components'
import theme from 'ts/components/styled/theme'
import GlobalStyle from 'ts/components/styled/global'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FirestoreContextProvider } from 'ts/hooks/use-store'
import { AuthContextProvider } from 'ts/hooks/use-auth'

import Create from 'ts/components/create'
import Account from 'ts/components/auth/account'
import Forgot from 'ts/components/auth/forgot'
import SignUp from 'ts/components/auth/signup'
import Layout from 'ts/components/Layout'
import LogIn from 'ts/components/auth/login'
import Shader from 'ts/components/shader-editor/shader'
import FullList from 'ts/components/shader-list/full-list'
import UserList from 'ts/components/shader-list/user-list'
import SearchList from 'ts/components/shader-list/search-list'

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <FirestoreContextProvider>
          <GlobalStyle />
          <GlobalStateProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route path="search/" element={<SearchList />} />
                  <Route path="list/" element={<FullList />} />
                  <Route path="list/user/:userId" element={<UserList />} />
                  <Route path="list/my" element={<UserList />} />
                  <Route path="shader/:shaderId" element={<Shader />} />
                  <Route index element={<FullList />} />
                </Route>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/account" element={<Account />} />
                <Route path="/create" element={<Create />} />
              </Routes>
            </BrowserRouter>
          </GlobalStateProvider>
        </FirestoreContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  )
}

export default App
