import React from 'react'
import styled from 'styled-components'

interface Props {
  name: string
  rating: number
  author: string
}

const Wrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;

  .title {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .author {
    font-size: 24px;
    color: #34586c;
  }

  .rating {
    font-size: 24px;
    color: #3b82a8;
  }

  h2 {
    font-size: 36px;
  }
`

const ShaderTitle = (props: Props) => {
  return (
    <Wrapper>
      <div className="title">
        <h2>{props.name}</h2>
        <span className="author">by {props.author}</span>
      </div>
      <span className="rating">{props.rating}</span>
    </Wrapper>
  )
}

export default ShaderTitle
