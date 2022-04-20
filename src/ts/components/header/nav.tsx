import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../styled/common'

const Nav = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div>
      <Button onClick={() => navigate('/create')}>Create</Button>
    </div>
  )
}

export default Nav
