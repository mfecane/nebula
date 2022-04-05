import React, { useContext, useState } from 'react'
import StateContext from 'ts/state-context'

import styles from 'ts/components/shader-details.module.scss'
import ShaderFpsBadge from 'ts/components/shader-fps-badge'
import ShaderControls from 'ts/components/shader-controls'
import ButtonArrow from 'ts/components/button-arrow'

const ShaderDetails = () => {
  const [{ shaderList, selectedShader, menuVisible }] = useContext(StateContext)
  const [collapsed, setCollapsed] = useState(false)

  const shader = shaderList.find(({ id }) => id === selectedShader)

  const collapse = () => {
    setCollapsed(!collapsed)
  }

  if (shader) {
    return (
      <div className={`${styles.container} ${menuVisible ? styles.shift : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{shader.name}</h2>
          <div className={styles.buttonContainer}>
            <ButtonArrow
              label={'Show options'}
              direction={0}
              onClick={collapse}
              labelPos={0}
              big
            />
          </div>
          <ShaderFpsBadge />
        </div>
        <div
          className={`${styles.controlContainer} ${
            collapsed ? styles.collapsed : null
          }`}
        >
          {!collapsed ? <ShaderControls /> : null}
        </div>
      </div>
    )
  } else return null
}

export default ShaderDetails
