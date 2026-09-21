import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { HomepageContentProvider } from './context/HomepageContentContext'
import ScrollToTop from './components/ScrollTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ScrollToTop/>
      <AuthProvider>
        <HomepageContentProvider>
          <App />
        </HomepageContentProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
