import React from 'react'
import { useNavigate } from 'react-router-dom'

import styles from 'ts/components/shader-list/shader-list-item.module.scss'

const ShaderListItem = ({ item }): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div
      className={styles.container}
      onClick={() => navigate(`/shader/${item.id}`)}
    >
      <h2 className={`${styles.title}`}>{item.name}</h2>
      <article className={styles.description}>{item.description}</article>
    </div>
  )
}

export default ShaderListItem
