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
import useAuth from 'ts/hooks/use-auth'

const LogIn = (): JSX.Element => {
  const [error, setError] = useState('')
  const [loading, setloading] = useState(false)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    setError('')
    setloading(true)
    login(emailRef.current.value, passwordRef.current.value)
      .then(() => {
        navigate('/')
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setloading(false)
      })
  }

  return (
    <ModalContainer>
      <Form onSubmit={handleSubmit}>
        <Logo big />
        <Header1>Log In</Header1>
        {error && <Message type="error">{error}</Message>}
        <InputGroup>
          <Label>Email</Label>
          <Input type="email" ref={emailRef} />
        </InputGroup>
        <InputGroup>
          <Label>Password</Label>
          <Input type="password" ref={passwordRef} />
        </InputGroup>
        <InputGroup>
          <Button disabled={loading}>Log In</Button>
        </InputGroup>
        <InputGroup>
          <span>
            Need and account? <Link to="/signup">Sign up</Link>.
          </span>
          <span>
            <Link to="/forgot">Forgot password?</Link>
          </span>
        </InputGroup>
      </Form>
    </ModalContainer>
  )
}

export default LogIn
