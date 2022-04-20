import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from 'ts/components/styled/common'
import useAuth from 'ts/hooks/use-auth'
import useFirestore from 'ts/hooks/use-firestore'

const UserName = styled.div`
  font-weight: bold;
  color: ${({ theme }) => {
    theme.accent
  }};
`

const HeaderUser = (): JSX.Element => {
  const { signout } = useAuth()
  const {
    state: { currentUser },
  } = useFirestore()
  const navigate = useNavigate()

  if (currentUser) {
    return (
      <>
        <UserName>
          <Link to="/account">{currentUser?.name || currentUser?.email}</Link>
        </UserName>
        <Button onClick={signout}>Log Out</Button>
      </>
    )
  } else {
    return (
      <>
        <Button
          onClick={() => {
            navigate('/login')
          }}
        >
          Log In
        </Button>
        <Button
          onClick={() => {
            navigate('/signup')
          }}
        >
          Sign Up
        </Button>
      </>
    )
  }
}

export default HeaderUser
