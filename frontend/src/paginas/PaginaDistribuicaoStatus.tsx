import React from 'react'
import GraficoDistribuicaoStatus from '../components/graficos/GraficoDistribuicaoStatus'
import LayoutPagina from '../layout/LayoutPagina'
import { useTest } from '../contexto/ContextoTeste'

const PaginaDistribuicaoStatus: React.FC = () => {
  const { lastTest } = useTest()
  const status = lastTest?.status
  const distribution = status ? {
    distribution: {
      '2xx': status >= 200 && status <= 299 ? 1 : 0,
      '3xx': status >= 300 && status <= 399 ? 1 : 0,
      '4xx': status >= 400 && status <= 499 ? 1 : 0,
      '5xx': status >= 500 ? 1 : 0,
    }
  } : undefined
  return (
    <LayoutPagina>
      {!distribution || !distribution.distribution ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
          Sem dados de distribuição de status ainda. Teste uma URL para gerar resultados.
          <div style={{ marginTop: '0.75rem' }}>
            <a href="/" style={{ color: '#2563eb' }}>Ir para Home</a>
          </div>
        </div>
      ) : (
        <GraficoDistribuicaoStatus distribution={distribution.distribution} />
      )}
    </LayoutPagina>
  )
}

export default PaginaDistribuicaoStatus
