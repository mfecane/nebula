import React, { useContext } from 'react'
import StateContext from 'ts/contexts/state-context'

import ShaderControls from 'ts/components/shader-controls'

import styles from 'ts/components/shader-details.module.scss'
import { useParams } from 'react-router-dom'

const ShaderDetails = () => {
  const [{ shaderList, selectedShader }, dispatch] = useContext(StateContext)
  let params = useParams()

  const shader = shaderList.find(
    ({ id }: { id: number }) => id === parseInt(params.shaderId)
  )

  if (shader) {
    return (
      <div className={styles.container}>
        <div>
          <button className={styles.backButton}>
            <i></i>
            <label>To gallery</label>
          </button>
        </div>
        <div className={styles.header}>
          <h2 className={styles.title}>{shader.name}</h2>
        </div>
        <div className={styles.controlContainer}>
          <ShaderControls />
        </div>
      </div>
    )
  } else return null
}

export default ShaderDetails
