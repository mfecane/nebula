import React, { useContext } from 'react'
import StateContext from 'ts/state-context'
import { setRenderer } from 'ts/renderer-manager'

import styles from 'ts/components/shader-list-item.module.scss'

const ShaderListItem = ({ item }) => {
  const [{ selectedShader }, dispatch] = useContext(StateContext)

  const onClick = () => {
    setRenderer(item.id)
    dispatch({
      type: 'setShader',
      payload: item.id,
    })
  }

  const active = selectedShader === item.id

  return (
    <div className={styles.container} onClick={onClick}>
      <h2 className={`${styles.title} ${active ? styles.selected : ''}`}>
        {item.name}
      </h2>
      <article className={styles.description}>{item.description}</article>
    </div>
  )
}

export default ShaderListItem
