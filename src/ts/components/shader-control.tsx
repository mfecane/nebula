import React, { useEffect, useState } from 'react'
import { setParameter } from 'ts/renderer-manager'

import styles from 'ts/components/shader-control.module.scss'

const ShaderControl = ({ item }) => {
  const [value, setValue] = useState(0.0)

  const label = item.label

  const onChange = (e) => {
    e.preventDefault()
    const value = e.target.value || 0
    setValue(value)
    setParameter(item.id, value)
  }

  useEffect(() => {
    setValue(item.default)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{label}</div>
        <div className={styles.value}>{value}</div>
      </div>
      <div className={styles.header}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          className={styles.slider}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default ShaderControl
