import React, { useContext } from 'react'
import StateContext from 'ts/state-context'

import styles from 'ts/components/error-container.module.scss'

export default () => {
  const [{ error }] = useContext(StateContext)
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <h3>Shader error</h3>
          {error.toString()}
        </div>
      </div>
    )
  }
  return null
}
