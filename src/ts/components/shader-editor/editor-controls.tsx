import React from 'react'
import { Row, Button } from 'ts/components/styled/common'
import useAuth from 'ts/hooks/use-auth'
import useStore from 'ts/hooks/use-store'

interface Props {
  handleUpdateShader: () => void
  handleSaveShader: () => void
  handleForkShader: () => void
}

const EditorControls = ({
  handleUpdateShader,
  handleSaveShader,
  handleForkShader,
}: Props): JSX.Element => {
  const {
    state: { currentShader, shaderError },
  } = useStore()
  const { currentUser } = useAuth()

  if (!currentUser) {
    return (
      <Row>
        <Button green onClick={handleUpdateShader}>
          Run
        </Button>
      </Row>
    )
  }

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
      <Button disabled={!!shaderError} onClick={handleForkShader}>
        Fork
      </Button>
    </Row>
  )
}

export default EditorControls
