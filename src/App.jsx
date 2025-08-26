import styled, { createGlobalStyle } from 'styled-components'
import Sidebar from './assets/sidebar'
import AppRoutes from './assets/routes/approutes'
import { useLocation } from 'react-router-dom'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: rgb(255, 255, 255);
  }
`

const MainContent = styled.div`
  padding: 20px;
  color: white;
`

function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/'

  return (
    <>
      <GlobalStyle />
      {!isLoginPage && <Sidebar />}
      <MainContent>
        <AppRoutes />
      </MainContent>
    </>
  )
}

export default App
