import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Canvas from 'ts/components/shader-editor/canvas'
import Editor from 'ts/components/shader-editor/editor'
import EditorContainer from 'ts/components/shader-editor/editor-container'
import useFirestore from 'ts/hooks/use-firestore'
import Spinner from 'ts/components/common/spinner'

const Shader = (): JSX.Element => {
  const { shaderId } = useParams()

  const {
    state: { shaderListLoading, currentShader },
    setCurrentShader,
  } = useFirestore()

  useEffect(() => {
    setCurrentShader(shaderId)
  }, [shaderListLoading, shaderId])

  if (shaderId !== currentShader?.id) {
    return null
  }

  if (shaderListLoading) {
    return <Spinner /> // TODO ::: spinner
  }

  return <EditorContainer left={<Editor />} right={<Canvas />} />
}

export default Shader
