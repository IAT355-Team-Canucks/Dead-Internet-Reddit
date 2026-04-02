import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Removed strict mode to prevent double render of components
createRoot(document.getElementById('root')).render(
  <App />

)
