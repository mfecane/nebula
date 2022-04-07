import React, { useState } from 'react'

import styles from 'ts/components/button-arrow.module.scss'

export default ({ onClick, label }) => {
  const [toggle, setToggle] = useState(true)

  const clickHandler = function (e) {
    setToggle(!toggle)
    onClick(e)
  }

  const buttonClassses = [styles.collapseButton]
  if (toggle) {
    buttonClassses.push(styles.toggle)
  }

  return (
    <button className={buttonClassses.join(' ')} onClick={clickHandler}>
      <i className={styles.arrowIcon} />
      <label>{label}</label>
    </button>
  )
}
