import styled, { css } from 'styled-components'

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

export const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: auto;
  padding: 0 20px;
`

export const Button = styled.button`
  padding: 8px 10px;
  min-width: 120px;
  border-radius: 3px;
  color: ${getColor('dark')};
  background-color: ${getColor('accent')};
  font-weight: bold;
`

export const IconButton = styled.button`
  padding: 8px;
  border-radius: 3px;
  color: ${getColor('dark')};
  background-color: ${getColor('accent')};
  font-weight: bold;
`

export const ButtonLink = styled.button`
  color: ${getColor('light')};
  font-weight: bold;
  font-size: 16px;

  a {
    color: white;
  }

  a:hover {
    color: white;
    text-decoration: underline;
  }
`

export const Header1 = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`

export const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #000000cc;
`

export const Row = styled.div`
  display: flex;
  margin: 16px 0;
  gap: 10px;
  padding: 16px;
  align-items: center;
  ${(props) =>
    props.center &&
    css`
      justify-content: center;
    `}
`
