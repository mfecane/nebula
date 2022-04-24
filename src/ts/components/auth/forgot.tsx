import React, { useRef, useState } from 'react'

import {
  Form,
  Input,
  InputGroup,
  Label,
  Message,
} from 'ts/components/styled/form'

import { Button, ModalContainer, Header1 } from 'ts/components/styled/common'
import { Link, useNavigate } from 'react-router-dom'
import Logo from 'ts/components/common/logo'
import useStore from 'ts/hooks/use-store'

const Forgot = (): JSX.Element => {
  const [error, setError] = useState('')
  const [loading, setloading] = useState(false)
  const emailRef = useRef(null)
  const { forgot } = useStore()
  let navigate = useNavigate()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    setError('')
    setloading(true)
    forgot(emailRef?.current?.value)
      .catch((err) => {
        setError(err.message)
      })
      .then(() => {
        navigate('/login')
      })
      .finally(() => {
        setloading(false)
      })
  }

  return (
    <ModalContainer>
      <Form onSubmit={handleSubmit}>
        <Logo big />
        <Header1>Forgot password</Header1>
        {error && <Message type="error">{error}</Message>}
        <InputGroup>
          <Label>Email</Label>
          <Input type="email" ref={emailRef} />
        </InputGroup>
        <InputGroup>
          <Button disabled={loading}>Send recovery link</Button>
        </InputGroup>
        <InputGroup>
          <span>
            Need and account? <Link to="/signup">Sign up</Link>.
          </span>
        </InputGroup>
      </Form>
    </ModalContainer>
  )
}

export default Forgot
