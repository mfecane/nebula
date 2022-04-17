import styled from 'styled-components'

const getColor =
  (prop: string) =>
  ({ theme }) =>
    theme[prop]

export const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export const Button = styled.button`
  padding: 8px 10px;
  min-width: 120px;
  border-radius: 3px;
  color: ${getColor('dark')};
  background-color: ${getColor('accent')};
  font-weight: bold;
`

export const Header1 = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`
