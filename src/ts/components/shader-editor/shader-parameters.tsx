import React, { useState } from 'react'

const ShaderParameters = () => {
  const [expanded, setExpanded] = useState(false)

  const shaderParametersJSX = <></>

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
