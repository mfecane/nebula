import React, { useState } from 'react'
import ShaderListItem from 'ts/components/shader-list/shader-list-item'

import styled from 'styled-components'
import { Container } from 'ts/components/styled/common'
import { ShaderState } from 'ts/hooks/use-store'
import Paginator, { MAX_ITEMS } from './paginator'

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px;
  height: 100%;
  overflow-y: auto;
  margin-bottom: 60px;
`

interface Props {
  list: ShaderState[]
}

const ShaderList = ({ list }: Props): JSX.Element => {
  const [page, setPage] = useState(0)

  let renderList = list

  const totalItems = renderList.length
  renderList = renderList
    .filter(
      (el: any, index: number) =>
        index >= page * MAX_ITEMS && index < (page + 1) * MAX_ITEMS
    )
    .sort((a, b) => {
      const aSec = a?.updated?.seconds || 0
      const bSec = b?.updated?.seconds || 0
      return bSec - aSec
    })

  console.log('renderList', renderList)

  const elementsJSX = renderList.map((item: ShaderState) => {
    return <ShaderListItem item={item} key={item.id} />
  })

  return (
    <>
      <List>
        {!!renderList.length && elementsJSX}
        {!renderList.length && 'Empty'}
      </List>
      <Paginator count={totalItems} setPage={setPage} />
    </>
  )
}

export default ShaderList
