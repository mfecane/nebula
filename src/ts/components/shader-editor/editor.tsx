import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ErrorWrapper } from 'ts/components/styled/common'
import useFirestore from 'ts/hooks/use-store'
import { ShaderModel } from 'ts/model/shader-model'
import CodeEditorImport from '@uiw/react-textarea-code-editor'
import EditorControls from './editor-controls'
import { toast } from 'react-toastify'

const CodeEditor = styled(CodeEditorImport)`
  flex: 2 1 auto;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

const Editor = (): JSX.Element => {
  const {
    state: { currentShader },
    saveShader,
    updateShader,
    setShaderError,
  } = useFirestore()
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    setCode(currentShader?.code)
  }, [currentShader])

  const handleSaveShader = () => {
    const save = async () => {
      setError('')
      try {
        updateShader({
          code,
        })
        await saveShader()
        toast.success('🦄 Saved!', {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        })
      } catch (e) {
        setError(e.message)
      }
    }
    save()
  }

  const handleUpdateShader = () => {
    const model = new ShaderModel()
    model.setSource(code)
    const error = model.validate()
    if (error) {
      setShaderError(error)
      return
    }

    updateShader({
      code,
    })
  }

  return (
    <Wrapper>
      {error && <ErrorWrapper>{error}</ErrorWrapper>}
      <CodeEditor
        value={code}
        language="glsl"
        placeholder="Please enter JS code."
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        style={{
          height: 0,
          // minHeight: '100%',
          backgroundColor: '#212b38',
          borderRadius: 3,
          margin: 16,
          marginRight: 2,
          fontSize: 16,
          flex: '1 0 auto',
          overflow: 'auto',
          fontFamily:
            'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
      <EditorControls
        handleUpdateShader={handleUpdateShader}
        handleSaveShader={handleSaveShader}
      />
    </Wrapper>
  )
}

export default Editor
