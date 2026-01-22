import React from 'react'
import CartaoPercentis from '../components/usual/latencia'
import LayoutPagina from '../layout/LayoutPagina'
import { useTest } from '../contexto/ContextoTeste'

const PaginaLatencia: React.FC = () => {
  const { lastTest } = useTest()
  const ms = lastTest?.durationMs ?? 0
  const percentiles = ms ? { percentiles: { p50: ms, p90: ms, p95: ms, p99: ms } } : undefined
  return (
    <LayoutPagina>
      {!percentiles || !percentiles.percentiles ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
          Sem dados de latência ainda. Teste uma URL para gerar resultados.
          <div style={{ marginTop: '0.75rem' }}>
            <a href="/" style={{ color: '#2563eb' }}>Ir para Home</a>
          </div>
        </div>
      ) : (
        <CartaoPercentis percentiles={percentiles.percentiles} />
      )}
    </LayoutPagina>
  )
}

export default PaginaLatencia
