import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  padding: 24px 32px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.dark};
  color: ${({ theme }) => theme.light};
  max-width: 450px;
  width: 450px;
  margin: 5px;
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0;

  &:last-child {
    margin-bottom: 0;
  }
`

export const Label = styled.label`
  flex: 0 1 auto;
`

export const Input = styled.input`
  color: ${({ theme }) => theme.accent};
  font-size: 1rem;
  border-radius: 3px;
  padding: 6px 8px;
  font-weight: 500;
`

// TODO fix type
export const Message = styled.div`
  color: ${({ theme }) => theme.dark};
  background-color: ${({ type, theme }: { type: string; theme: any }) => {
    switch (type) {
      case 'success':
        return '#6bdd76'
      case 'error':
        return '#f16d6d'
      case 'message':
      default:
        return theme.light
    }
  }};
  padding: 8px 12px;
  border-radius: 3px;
  margin: 6px 0;
`
