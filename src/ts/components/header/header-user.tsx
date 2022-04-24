import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { IconButton } from 'ts/components/styled/common'
import useStore from 'ts/hooks/use-store'
import UserMenu from 'ts/components/header/user-menu'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  gap: 12px;
  align-items: center;
  align-self: stretch;
`

const UserName = styled.div`
  font-weight: bold;
  color: ${({ theme }) => {
    theme.accent
  }};
`

const MenuContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: black;
  padding: 10px;
  z-index: 6;
`

const Icon = styled.i`
  display: block;
  width: 24px;
  height: 24px;
  background-color: white;
`

const HeaderUser = (): JSX.Element => {
  const {
    state: { currentUser },
  } = useStore()
  const [showMenu, setShowMenu] = useState(false)
  const ref = useRef()

  const hadleMenuClick = (e) => {
    setShowMenu((current) => !current)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      event.stopPropagation()
      if (!ref?.current?.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
  }, [ref])

  return (
    <Wrapper>
      <UserName>
        <Link to="/account">{currentUser?.name || currentUser?.email}</Link>
      </UserName>
      <IconButton onClick={hadleMenuClick}>
        <Icon className="icon icon-burger" />
      </IconButton>
      {showMenu && (
        <MenuContainer ref={ref}>
          <UserMenu />
        </MenuContainer>
      )}
    </Wrapper>
  )
}

export default HeaderUser
