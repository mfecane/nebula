import React from 'react'
import { Row, Button } from 'ts/components/styled/common'
import useAuth from 'ts/hooks/use-auth'
import useFirestore from 'ts/hooks/use-store'

interface Props {
  handleUpdateShader: () => void
  handleSaveShader: () => void
}

const EditorControls = ({
  handleUpdateShader,
  handleSaveShader,
}: Props): JSX.Element => {
  const {
    state: { currentShader, shaderError },
  } = useFirestore()
  const { currentUser } = useAuth()

  if (currentShader.user.uid === currentUser.uid) {
    return (
      <Row>
        <Button green onClick={handleUpdateShader}>
          Run
        </Button>
        <Button onClick={handleSaveShader} disabled={!!shaderError}>
          Save
        </Button>
      </Row>
    )
  }

  return (
    <Row>
      <Button green onClick={handleUpdateShader}>
        Run
      </Button>
      <Button disabled={!!shaderError}>Fork</Button>
    </Row>
  )
}

export default EditorControls
