import React, { useRef, useEffect, useState } from 'react'

import styles from 'ts/components/side-bar.module.scss'

import ButtonArrow from 'ts/components/button-arrow'

const cancelEvent = (e) => {
  e.stopPropagation()
}

export default ({ children }) => {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  const collapse = () => {
    setVisible(!visible)
  }

  useEffect(() => {
    ref.current.addEventListener('mousedown', cancelEvent)
    ref.current.addEventListener('wheel', cancelEvent)
  }, [])

  return (
    <div
      className={`${styles.sidebar} ${!visible ? styles.collapsed : ''}`}
      ref={ref}
    >
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
