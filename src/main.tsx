import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppContext'
import { CustomerAuthProvider } from './context/CustomerAuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomerAuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </CustomerAuthProvider>
  </StrictMode>,
)
