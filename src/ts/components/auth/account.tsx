import React, { useEffect, useRef, useState } from 'react'
import { Button, ModalContainer, Header1 } from 'ts/components/styled/common'
import {
  Form,
  Input,
  InputGroup,
  Label,
  Message,
} from 'ts/components/styled/form'
import Logo from 'ts/components/common/logo'
import useStore from 'ts/hooks/use-store'

const Account = (): JSX.Element => {
  const [error, setError] = useState('')
  const [success, setSucess] = useState(false)
  const [loading, setloading] = useState(false)
  const {
    state: { currentUser },
    updateCurrentUser,
  } = useStore()
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const passwordConfirmRef = useRef<HTMLInputElement>()

  const reset = () => {
    setError('')
    setSucess(false)
    setloading(false)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (loading) return

    setError('')
    setSucess(false)
    setloading(true)

    const password = passwordRef?.current?.value || ''
    const passwordConfirm = passwordConfirmRef?.current?.value || ''

    if (password && passwordConfirm && password === passwordConfirm) {
      setError('Passwords do not match')
    }

    try {
      if (nameRef.current.value) {
        await updateCurrentUser({
          name: nameRef.current.value,
        })
      }
      setSucess(true)
      setloading(false)
    } catch (e) {
      setError(e.message)
      setloading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(reset, 5000)
    return () => {
      clearTimeout(timeout)
    }
  }, [error, success, loading])

  return (
    <ModalContainer>
      <Form onSubmit={handleSubmit}>
        <Logo big />
        <Header1>Account</Header1>
        {success && <Message type="success">Data successfully saved</Message>}
        {error && <Message type="error">{error}</Message>}
        <InputGroup>
          <Label>User name</Label>
          <Input type="text" ref={nameRef} defaultValue={currentUser?.name} />
        </InputGroup>
        <InputGroup>
          <Label>Email</Label>
          <Input
            type="email"
            ref={emailRef}
            defaultValue={currentUser?.email}
          />
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
          <Button disabled={loading}>Save</Button>
        </InputGroup>
      </Form>
    </ModalContainer>
  )
}

export default Account
