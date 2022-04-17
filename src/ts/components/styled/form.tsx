import { styled } from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`

export const Input = styled.input`
  color: ${({ colors }) => colors.dark};
`
