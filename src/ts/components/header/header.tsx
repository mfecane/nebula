import React from 'react'
import styled from 'styled-components'
import HeaderUser from 'ts/components/header/header-user'
import Logo from 'ts/components/common/logo'
import { Container } from 'ts/components/styled/common'
import Nav from 'ts/components/header/nav'

const Wrapper = styled.div`
  width: 100%;
  background-color: black;
  border-bottom: 4px solid #2b3d57;
  flex: 0 0 auto;
`
const WrapperInner = styled.div`
  width: 100%;
  background-color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const UserWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export default (): JSX.Element => {
  return (
    <Wrapper>
      <Container>
        <WrapperInner>
          <Logo />
          <Nav />
          <UserWrapper>
            <HeaderUser />
          </UserWrapper>
        </WrapperInner>
      </Container>
    </Wrapper>
  )
}
