import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import ShaderTitle from 'ts/components/shader-editor/shader-title'
import useGlobalState from 'ts/contexts/state-context'

import ShaderFpsBadge from 'ts/components/shader-editor/shader-fps-badge'
import RendererCode from 'ts/renderers/renderer-code'
import { CreateRenderer } from 'ts/model/shader-code-factory'
import { getShaderList } from 'ts/shader-registry'

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .canvasOuter {
    flex: 1 1 auto;
    overflow: hidden;
    min-height: 0;
    position: relative;
  }

  .aspectWrapper {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

  .parameters {
    flex: 0 0 auto;
  }
`

const CanvasContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
`

const Canvas = (): JSX.Element => {
  const [{ selectedShader }] = useGlobalState()
  const [error, setError] = useState()
  let renderer: RendererCode

  const list = getShaderList()
  const shader = list.find(
    ({ id: id1 }: { id: number }) => id1 === selectedShader
  )
  const ref = useRef(null)

  useEffect(() => {
    const createRenderer = new CreateRenderer()
    createRenderer.createRenerer(ref.current, shader.fragmentSource)

    if (renderer)
      return () => {
        renderer.destroy()
      }
  }, [selectedShader])

  return (
    <Wrapper>
      <ShaderTitle name="Shader" author="Mfecane" rating={3000}></ShaderTitle>
      <div className="canvasOuter">
        <CanvasContainer ref={ref}>
          <ShaderFpsBadge />
        </CanvasContainer>
      </div>
    </Wrapper>
  )
}

export default Canvas
