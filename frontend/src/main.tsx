import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ReportProvider } from './ReportContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReportProvider>
      <App />
    </ReportProvider>
  </React.StrictMode>,
)
