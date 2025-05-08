import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Auth0ProviderWithNavigate } from './auth/auth0-provider-with-navigate.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0ProviderWithNavigate>
      <App />
    </Auth0ProviderWithNavigate>
  </StrictMode>,
)