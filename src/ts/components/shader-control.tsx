import React, { useRef, useEffect, useState } from 'react'

import styles from 'ts/components/shader-control.module.scss'

const ShaderControl = ({ item }) => {
  const ref = useRef()
  const [value, setValue] = useState(0.0)

  const label = item.label

  const onChange = (e) => {
    e.preventDefault()
    setValue(e.target.value)
  }

  useEffect(() => {
    ref.current.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{label}</div>
        <div className={styles.value}>{value}</div>
      </div>
      <div className={styles.header}>
        <input
          ref={ref}
          type="range"
          min="0"
          max="100"
          value={value}
          className={styles.slider}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default ShaderControl
