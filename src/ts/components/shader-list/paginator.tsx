import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from 'ts/components/styled/common'

export const MAX_ITEMS = 9

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
`

interface Props {
  page?: number
  count: number
  setPage: (i: number) => void
}

const Paginator = ({ page = 0, count, setPage }: Props): JSX.Element => {
  const [_page, _setPage] = useState(page)

  useEffect(() => {
    _setPage(_page)
    setPage(_page)
  }, [_page])

  const handleClick = (i: number) => {
    if (i === _page) return
    _setPage(i)
  }

  if (count <= MAX_ITEMS) {
    return null
  }

  const itemsJSX = []
  for (let i = 0; i < count / MAX_ITEMS; ++i) {
    const disabled = i === _page
    itemsJSX.push(
      <div key={i}>
        <Button
          green={disabled}
          onClick={handleClick.bind(null, i)}
          disabled={disabled}
        >
          {i}
        </Button>
      </div>
    )
  }

  return <Wrapper>{itemsJSX}</Wrapper>
}

export default Paginator
