import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from 'ts/components/header/header'

const Layout = (): JSX.Element => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Layout
