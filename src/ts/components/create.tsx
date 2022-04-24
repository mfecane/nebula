import React, { useRef, useState } from 'react'
import useStore from 'ts/hooks/use-store'

import {
  Form,
  Input,
  InputGroup,
  Label,
  Message,
} from 'ts/components/styled/form'

import { Button, ModalContainer, Header1 } from 'ts/components/styled/common'
import { useNavigate } from 'react-router-dom'
import Logo from 'ts/components/common/logo'

const Create = (): JSX.Element => {
  const [error, setError] = useState('')
  const [loading, setloading] = useState(false)
  const nameRef = useRef(null)
  const navigate = useNavigate()
  const { createShader } = useStore()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setloading(true)
    setError('')
    const shader = await createShader(nameRef.current.value)
    navigate('/shader/' + shader.id)
    setloading(false)
  }

  return (
    <ModalContainer>
      <Form onSubmit={handleSubmit}>
        <Logo big />
        <Header1>Create</Header1>
        {error && <Message type="error">{error}</Message>}
        <InputGroup>
          <Label>Name</Label>
          <Input type="name" ref={nameRef} />
        </InputGroup>
        <InputGroup>
          <Button disabled={loading}>Create</Button>
        </InputGroup>
      </Form>
    </ModalContainer>
  )
}

export default Create
