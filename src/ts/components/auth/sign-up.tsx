import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from 'ts/contexts/auth-context'

import {
  Form,
  Input,
  InputGroup,
  Label,
  Message,
} from 'ts/components/styled/form'

import { Button, CenterContainer, Header1 } from 'ts/components/styled/common'

const SignUp = (): JSX.Element => {
  const [error, setError] = useState('')
  const [loading, setloading] = useState(false)
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef<HTMLInputElement>()
  const { signup } = useAuth()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (passwordRef?.current.value !== passwordConfirmRef?.current.value) {
      setError('Passwords do nnot match')
    }

    setloading(true)
    signup(emailRef.current.value, passwordRef.current.value)
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setloading(false)
      })
  }

  return (
    <CenterContainer>
      <Form onSubmit={handleSubmit}>
        <Header1>Sign up</Header1>
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
          <Label>Confirm password</Label>
          <Input type="password" ref={passwordConfirmRef} />
        </InputGroup>
        <InputGroup>
          <Button>Sign Up</Button>
        </InputGroup>
        <InputGroup>
          <span>
            If you have an account <a>log in</a>.
          </span>
          <span>Forgot password?</span>
        </InputGroup>
      </Form>
    </CenterContainer>
  )
}

export default SignUp
