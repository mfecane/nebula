import React, { useRef, useState } from 'react'
import { Button, ModalContainer, Header1 } from 'ts/components/styled/common'
import { Link, useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  InputGroup,
  Label,
  Message,
} from 'ts/components/styled/form'
import Logo from 'ts/components/common/logo'
import useAuth from 'ts/hooks/use-auth'

const SignUp = (): JSX.Element => {
  const [error, setError] = useState('')
  const [loading, setloading] = useState(false)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const passwordConfirmRef = useRef<HTMLInputElement>()
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (passwordRef?.current?.value !== passwordConfirmRef?.current?.value) {
      setError('Passwords do nnot match')
    }

    setError('')
    setloading(true)
    signup(emailRef?.current?.value, passwordRef?.current?.value)
      .then(() => {
        navigate('/login')
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setloading(false)
      })
  }

  return (
    <ModalContainer>
      <Form onSubmit={handleSubmit}>
        <Logo big />
        <Header1>Sign up</Header1>
        {error && <Message type="error">{error}</Message>}
        <InputGroup>
          <Label>Email</Label>
          <Input
            type="email"
            defaultValue="aaliapkinrb@gmail.com"
            ref={emailRef}
          />
        </InputGroup>
        <InputGroup>
          <Label>Password</Label>
          <Input type="password" defaultValue="1234567ab" ref={passwordRef} />
        </InputGroup>
        <InputGroup>
          <Label>Confirm password</Label>
          <Input
            type="password"
            defaultValue="1234567ab"
            ref={passwordConfirmRef}
          />
        </InputGroup>
        <InputGroup>
          <Button disabled={loading}>Sign Up</Button>
        </InputGroup>
        <InputGroup>
          <span>
            If you already have an account, <Link to="/login">log in</Link>.
          </span>
        </InputGroup>
      </Form>
    </ModalContainer>
  )
}

export default SignUp
