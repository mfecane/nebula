import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import ShaderTitle from 'ts/components/shader-editor/shader-title'

import ShaderFpsBadge from 'ts/components/shader-editor/shader-fps-badge'
import RendererCode from 'ts/renderers/renderer-code'
import { CreateRenderer } from 'ts/model/shader-code-factory'
import useFirestore from 'ts/hooks/use-firestore'

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
  const ref = useRef(null)
  const {
    state: { currentShader },
  } = useFirestore()

  let renderer: RendererCode
  console.log('render Canvas')

  useEffect(() => {
    if (currentShader) {
      if (renderer) {
        renderer.destroy()
      }

      console.log('CreateRenderer')
      const createRenderer = new CreateRenderer()
      renderer = createRenderer.createRenerer(ref.current, currentShader.code)

      if (renderer)
        return () => {
          renderer.destroy()
        }
    }
  }, [currentShader])

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
