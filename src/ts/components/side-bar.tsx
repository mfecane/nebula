import React, { useState } from 'react'

import styles from 'ts/components/side-bar.module.scss'

import ButtonArrow from 'ts/components/button-arrow'

export default ({ children }) => {
  const [visible, setVisible] = useState(false)

  const collapse = () => {
    setVisible(!visible)
  }

  return (
    <div className={`${styles.sidebar} ${!visible ? styles.collapsed : ''}`}>
      {children}
      <div className={styles.button}>
        <ButtonArrow
          label={'Expand'}
          direction={1}
          onClick={collapse}
          labelPos={1}
          big
          dark
        />
      </div>
    </div>
  )
}
