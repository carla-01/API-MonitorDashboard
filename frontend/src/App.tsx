import React from 'react'
import BarraSuperior from './components/topbar/topbar'
import Rodape from './components/footer/footer'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import ErrorBoundary from './components/usual/ErrorBoundary'
import { TestProvider } from './contexto/ContextoTeste'
import './estilos.css'
import {BrowserRouter,Routes,Route,Navigate
} from 'react-router-dom'
import PaginaTempoResposta from './paginas/PaginaTempoResposta'
import PaginaTaxaErros from './paginas/PaginaTaxaErros'
import PaginaDistribuicaoStatus from './paginas/PaginaDistribuicaoStatus'
import PaginaLatencia from './paginas/PaginaLatencia'
import PaginaApis from './paginas/PaginaApis'
import PaginaAlertas from './paginas/PaginaAlertas'
import PaginaInicial from './paginas/PaginaInicial'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity
    }
  }
})

function AppContent() {
  const queryClient = useQueryClient()
  const handleRefresh = () => {
    queryClient.invalidateQueries()
  }

  const handleNavigate = (section: string) => {
    const el = document.getElementById(section)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="app-wrapper">
      <BarraSuperior title="API Monitor Dashboard" onRefresh={handleRefresh} />
      <div className="content-wrapper">
      <Routes>
        <Route path="/" element={<PaginaInicial />} />
        <Route path="/response-time" element={<PaginaTempoResposta />} />
        <Route path="/error-rate" element={<PaginaTaxaErros />} />
        <Route path="/status-distribution" element={<PaginaDistribuicaoStatus />} />
        <Route path="/percentiles" element={<PaginaLatencia />} />
        <Route path="/apis" element={<PaginaApis />} />
        <Route path="/url-tester" element={<Navigate to="/" replace />} />
        <Route path="/alerts" element={<PaginaAlertas />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
      <Rodape />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TestProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </BrowserRouter>
      </TestProvider>
    </QueryClientProvider>
  )
}

export default App
