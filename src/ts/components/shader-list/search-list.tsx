import React from 'react'
import styled from 'styled-components'
import useStore from 'ts/hooks/use-store'
import { Container } from '../styled/common'
import ShaderList from './shader-list'

const Wrapper = styled.div`
  overflow: auto;
  min-height: 0;
`

const Header = styled.h3`
  font-size: 2rem;
  margin: 30px 0;
`

const SearchList = () => {
  const {
    state: { shaderList, search },
  } = useStore()

  let renderList = shaderList
  renderList = shaderList.filter(
    (el) => el.name.toLowerCase().indexOf((search || '').toLowerCase()) !== -1
  )

  if (!search) renderList = []

  return (
    <Wrapper>
      <Container>
        <Header>Search {search}</Header>
        <ShaderList list={renderList} />
      </Container>
    </Wrapper>
  )
}

export default SearchList
