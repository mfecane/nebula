import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from 'ts/components/header/header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Layout = (): JSX.Element => {
  return (
    <>
      <Header />
      <Outlet />
      <ToastContainer theme="dark" />
    </>
  )
}

export default Layout
