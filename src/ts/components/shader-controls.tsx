import React, { useContext } from 'react'
import StateContext from 'ts/contexts/state-context'

import ShaderControl from 'ts/components/shader-control'

import styles from 'ts/components/shader-controls.module.scss'

const ShaderControls = () => {
  const [{ shaderList, selectedShader }] = useContext(StateContext)

  const shader = shaderList.find(({ id }) => id === selectedShader)

  if (shader.parameters) {
    const elements = shader.parameters.map((item) => (
      <ShaderControl item={item} key={item.id} />
    ))

    return <div className={styles.container}>{elements}</div>
  }
  return null
}

export default ShaderControls
