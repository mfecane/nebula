import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  #app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: ${({ theme }) => theme.dark2};
  }

  a {
    color: ${({ theme }) => theme.accent};
  }

  a:hover {
    color: ${({ theme }) => theme.light};
  }
`

export default GlobalStyle
