import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Canvas from 'ts/components/shader-editor/canvas'
import Editor from 'ts/components/shader-editor/editor'
import EditorContainer from 'ts/components/shader-editor/editor-container'
import useGlobalState from 'ts/contexts/state-context'

const Shader = (): JSX.Element => {
  const { shaderId } = useParams()
  const [{ selectedShader }, dispatch] = useGlobalState()

  useEffect(() => {
    dispatch({ type: 'setShader', payload: +shaderId })
  }, [shaderId])

  if (+shaderId !== selectedShader) {
    return null
  }

  return <EditorContainer left={<Editor />} right={<Canvas />} />
}

export default Shader
