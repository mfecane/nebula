import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ButtonLink } from '../styled/common'

const Wrapper = styled.div`
  display: flex;
  gap: 16px;
  justify-self: stretch;
`

const Nav = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <Wrapper>
      <ButtonLink>
        <Link to="/create">Create</Link>
      </ButtonLink>
      <ButtonLink>
        <Link to="/create">Browse</Link>
      </ButtonLink>
    </Wrapper>
  )
}

export default Nav
