import React, { useEffect } from 'react'
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

const FullList = (): JSX.Element => {
  const {
    state: { shaderList },
    doSearch,
  } = useStore()

  // TODO handle this hit better
  useEffect(() => {
    doSearch('')
  }, [])

  return (
    <Wrapper>
      <Container>
        <Header>Shader gallery</Header>
        <ShaderList list={shaderList} />
      </Container>
    </Wrapper>
  )
}

export default FullList
