import React, { useState } from 'react'
import useStore from 'ts/hooks/use-store'
import { ShaderModel } from 'ts/model/shader-model'
import ShaderParameter from 'ts/components/shader-editor/shader-parameter'

const ShaderParameters = (): JSX.Element => {
  const [expanded, setExpanded] = useState(false)
  const {
    state: { currentShader },
  } = useStore()
  const model = new ShaderModel()
  model.setSource(currentShader.code)
  const shaderParametersJSX = model.uniforms.map((el) => (
    <ShaderParameter key={el.token} {...el} />
  ))

  return (
    <>
      <div onClick={() => setExpanded(!expanded)}>
        <h2>Shader parameters</h2>
      </div>
      <div>{shaderParametersJSX}</div>
    </>
  )
}

export default ShaderParameters
