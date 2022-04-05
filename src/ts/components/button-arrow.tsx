import React, { useState } from 'react'

import styles from 'ts/components/button-arrow.module.scss'

const directionClasses = [styles.arrowUp, styles.arrowRight]

export default ({ direction, onClick, label, labelPos, big = false }) => {
  const [toggle, setToggle] = useState(false)

  const clickHandler = function (e) {
    setToggle(!toggle)
    onClick(e)
  }

  const labelJSX = <label>{label}</label>

  return (
    <button
      className={`${styles.collapseButton} ${big ? styles.big : ''} ${
        toggle ? styles.toggle : ''
      }`}
      onClick={clickHandler}
    >
      {labelPos === 0 ? labelJSX : null}
      <i className={`${styles.arrowIcon} ${directionClasses[direction]}`} />
      {labelPos === 1 ? labelJSX : null}
    </button>
  )
}
