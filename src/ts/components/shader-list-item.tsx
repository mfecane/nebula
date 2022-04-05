import React, {useContext} from 'react'
import StateContext from 'ts/state-context'

import styles from 'ts/components/shader-list-item.module.scss'

const ShaderListItem = ({ item }) => {
  const [state, dispatch] = useContext(StateContext)

  const onClick = () =>
    dispatch({
      type: 'setShader',
      payload: item.id,
    })

  return (
    <div className={styles.container} onClick={onClick}>
      <h2 className={styles.title}>{item.name}</h2>
      <article className={styles.description}>{item.description}</article>
    </div>
  )
}

export default ShaderListItem
