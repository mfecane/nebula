import React, { useContext } from 'react'
import StateContext from 'ts/state-context'
import ShaderListItem from 'ts/components/shader-list-item'
import ShaderListCollapse from 'ts/components/shader-list-collapse'

import styles from 'ts/components/shader-list.module.scss'

const ShaderList = () => {
  const [{ shaderList, menuVisible }, dispatch] = useContext(StateContext)

  const elementsJSX = shaderList.map((part) => {
    return <ShaderListItem item={part} key={part.id} />
  })

  const classes = `${styles.container}
    ${menuVisible ? '' : styles.hidden}`

  return (
    <div className={classes}>
      <div className={styles.list}>
        <ul>{elementsJSX}</ul>
      </div>
      <ShaderListCollapse />
    </div>
  )
}

export default ShaderList
