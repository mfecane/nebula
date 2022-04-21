import React, { useState } from 'react'
import styled from 'styled-components'
import HeaderUser from 'ts/components/header/header-user'
import Logo from 'ts/components/common/logo'
import { Container } from 'ts/components/styled/common'
import Nav from 'ts/components/header/nav'
import UserMenu from 'ts/components/header/user-menu'
import useAuth from 'ts/hooks/use-auth'
import HeaderAuth from './header-auth'

const Wrapper = styled.div`
  width: 100%;
  background-color: black;
  border-bottom: 4px solid #2b3d57;
  flex: 0 0 auto;
  position: relative;
`

const WrapperInner = styled.div`
  width: 100%;
  background-color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 85px;
`

export default (): JSX.Element => {
  const { currentUser } = useAuth()

  return (
    <Wrapper>
      <Container>
        <WrapperInner>
          <Logo />
          <Nav />
          {currentUser && <HeaderUser />}
          {!currentUser && <HeaderAuth />}
        </WrapperInner>
      </Container>
    </Wrapper>
  )
}
