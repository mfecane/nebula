import React from 'react'
import styled from 'styled-components'
import useAuth from 'ts/hooks/use-auth'
import { Link } from 'react-router-dom'

const Wrapper = styled.div`
  hr {
    margin: 12px 12px;
    height: 2px;
    background-color: white;
  }
`

const Option = styled.div`
  padding: 12px 16px;
  font-weight: bold;
  min-width: 280px;

  a {
    cursor: pointer;
    color: white;
  }

  a:hover {
    color: white;
    text-decoration: underline;
  }
`

const UserMenu = (): JSX.Element => {
  const { signout } = useAuth()

  return (
    <Wrapper>
      <Option>
        <Link to="/create">Create shader</Link>
      </Option>
      <Option>
        <Link to="/list/my">Your shaders</Link>
      </Option>
      <hr />
      <Option>
        <Link to="/account">Profile</Link>
      </Option>
      <Option>
        <a onClick={signout}>Logout</a>
      </Option>
    </Wrapper>
  )
}

export default UserMenu
