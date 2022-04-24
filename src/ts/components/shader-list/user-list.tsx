import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
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

const UserList = () => {
  const {
    state: { shaderList, currentUser },
    getuserById,
    doSearch,
  } = useStore()

  useEffect(() => {
    doSearch('')
  }, [])

  let { userId } = useParams()
  let user
  if (userId) {
    user = getuserById(userId) || null
  } else {
    userId = currentUser.uid
    user = currentUser
  }

  let renderList = shaderList
  renderList = shaderList.filter((el) => el.user?.uid === userId)

  return (
    <Wrapper>
      <Container>
        <Header>Shaders by {user.name}</Header>
        <ShaderList list={renderList} />
      </Container>
    </Wrapper>
  )
}

export default UserList
