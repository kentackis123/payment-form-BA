import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'antd/dist/reset.css'
import './index.css'
import './i18n'
import { MessageProvider } from './contexts/MessageContext'
import App from './App.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MessageProvider>
        <App />
      </MessageProvider>
    </QueryClientProvider>
  </StrictMode>,
)
