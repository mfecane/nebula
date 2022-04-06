import React, { useContext } from 'react'
import StateContext from 'ts/state-context'

import ShaderControls from 'ts/components/shader-controls'
import { PAGES } from 'ts/pages'

import styles from 'ts/components/shader-details.module.scss'

const ShaderDetails = () => {
  const [{ shaderList, selectedShader }, dispatch] = useContext(StateContext)

  const shader = shaderList.find(
    ({ id }: { id: number }) => id === selectedShader
  )

  if (shader) {
    return (
      <div className={styles.container}>
        <div>
          <button
            className={styles.backButton}
            onClick={() => {
              dispatch({
                type: 'setPage',
                payload: PAGES.PAGE_LIST,
              })
            }}
          >
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
