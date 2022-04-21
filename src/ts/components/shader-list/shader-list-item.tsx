import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 20px 32px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(90, 167, 234, 0.142);
  }

  h2 {
    font-weight: bold;
    font-size: 16px;
  }
`

const ShaderListItem = ({ item }): JSX.Element => {
  const navigate = useNavigate()

  return (
    <Wrapper onClick={() => navigate(`/shader/${item.id}`)}>
      <h2>{item.name}</h2>
      <div></div>
    </Wrapper>
  )
}

export default ShaderListItem
