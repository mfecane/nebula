import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CodeEditorImport from '@uiw/react-textarea-code-editor'
import { Row, Button } from 'ts/components/styled/common'
import useFirestore from 'ts/hooks/use-firestore'

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
        saveShader()
      } catch (e) {
        setError(e.message)
      }
    }
    save()
  }

  const handleUpdateShader = () => {
    updateShader({
      code,
    })
  }

  console.log('render editor')

  return (
    <Wrapper>
      {error}
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
      <Row>
        <Button onClick={handleUpdateShader}>Run</Button>
        <Button>Fork</Button>
        <Button onClick={handleSaveShader}>Save</Button>
      </Row>
    </Wrapper>
  )
}

export default Editor
