import React from 'react'
import ShaderListItem from 'ts/components/shader-list/shader-list-item'

import styled from 'styled-components'
import { Container } from 'ts/components/styled/common'
import useGlobalState from 'ts/contexts/state-context'
import useFirestore from 'ts/hooks/use-firestore'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.dark2};
`

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`

const Header = styled.h3`
  font-size: 2rem;
  margin: 30px;
`

const ShaderList = (): JSX.Element => {
  const {
    state: { shaderList },
  } = useFirestore()

  const elementsJSX = shaderList.map((part) => {
    return <ShaderListItem item={part} key={part.id} />
  })

  return (
    <Wrapper>
      <Container>
        <Header>Shader gallery</Header>
        <List>{elementsJSX}</List>
      </Container>
    </Wrapper>
  )
}

export default ShaderList
