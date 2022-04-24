import React, { useState } from 'react'
import useStore from 'ts/hooks/use-store'
import { ShaderModel } from 'ts/model/shader-model'
import ShaderParameter from 'ts/components/shader-editor/shader-parameter'
import styled from 'styled-components'

const Wrapper = styled.div`
  h2 {
    margin: 12px 0 8px 0;
    font-size: 16px;
    font-weight: bold;
  }
`
const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  background-color: #223039;
  border-radius: 3px;
  padding: 8px;
  gap: 16px;
`

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
      <Wrapper onClick={() => setExpanded(!expanded)}>
        <h2>Shader parameters</h2>
        <Layout>{shaderParametersJSX}</Layout>
      </Wrapper>
    </>
  )
}

export default ShaderParameters
