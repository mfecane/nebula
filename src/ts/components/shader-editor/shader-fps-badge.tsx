import React, { useEffect, useState } from 'react'
import { getFps } from 'ts/renderer-manager'

import styles from 'ts/components/shader-editor/shader-fps-badge.module.scss'

const ShaderFpsBadge = () => {
  const [value, setValue] = useState(0.0)
  let timeout

  useEffect(() => {
    timeout = setInterval(() => {
      const fps = getFps()
      setValue(fps)
    }, 500)
    return () => {
      clearInterval(timeout)
    }
  })

  return (
    <div className={styles.container}>
      <div className={styles.label}>FPS</div>
      <div className={styles.value}>{value.toString()}</div>
    </div>
  )
}

export default ShaderFpsBadge
