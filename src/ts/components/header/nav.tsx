import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Search from '../shader-list/search'
import { ButtonLink } from '../styled/common'

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-self: stretch;
`

const Nav = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <Wrapper>
      <Search />
      <ButtonLink>
        <Link to="/list">Browse</Link>
      </ButtonLink>
      <ButtonLink>
        <Link to="/create">Create</Link>
      </ButtonLink>
    </Wrapper>
  )
}

export default Nav
