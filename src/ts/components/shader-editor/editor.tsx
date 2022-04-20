import React, { useEffect } from 'react'
import styled from 'styled-components'
import CodeEditorImport from '@uiw/react-textarea-code-editor'
import { Row, Button } from 'ts/components/styled/common'
import useGlobalState from 'ts/contexts/state-context'
import { getShaderList } from 'ts/shader-registry'
import { createRenerer } from 'ts/model/shader-code-factory'

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
  const [{ selectedShader }, dispatch] = useGlobalState()

  const list = getShaderList()
  const shader = list.find(
    ({ id: id1 }: { id: number }) => id1 === selectedShader
  )

  // const [code, setCode] = React.useState(
  //   `function add(a, b) {\n  return a + b;\n}`
  // )

  // useEffect(() => {
  //   new ShaderCode(code)
  // }, [code])

  return (
    <Wrapper>
      <CodeEditor
        value={shader.fragmentSource}
        language="glsl"
        placeholder="Please enter JS code."
        onChange={() => void 0}
        padding={15}
        style={{
          height: 0,
          // minHeight: '100%',
          backgroundColor: '#2B3D57',
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
        <Button>Run</Button>
        <Button>Fork</Button>
        <Button>Save</Button>
      </Row>
    </Wrapper>
  )
}

export default Editor
