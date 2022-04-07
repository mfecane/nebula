import React, { useContext } from 'react'
import StateContext from 'ts/state-context'
import ShaderListItem from 'ts/components/shader-list-item'

import styles from 'ts/components/shader-list.module.scss'

const ShaderList = () => {
  const [{ shaderList, menuVisible }, dispatch] = useContext(StateContext)

  const elementsJSX = shaderList.map((part) => {
    return <ShaderListItem item={part} key={part.id} />
  })

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Shader gallery</h3>
      <div className={styles.list}>
        <ul>{elementsJSX}</ul>
      </div>
    </div>
  )
}

export default ShaderList
