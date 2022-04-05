import React, { useContext } from 'react'

import StateContext from 'ts/state-context'

import styles from 'ts/components/shader-list-collapse.module.scss'

const ShaderListCollapse = () => {
  const [{ menuVisible }, dispatch] = useContext(StateContext)

  const onClick = () => {
    dispatch({
      type: 'toggleMenu',
    })
  }

  const classes = `${styles.collapseButton}
    ${menuVisible ? styles.flip : ''}`

  return (
    <button className={classes} onClick={onClick}>
      <i className={styles.arrowIcon} />
      <label>View list</label>
    </button>
  )
}

export default ShaderListCollapse
