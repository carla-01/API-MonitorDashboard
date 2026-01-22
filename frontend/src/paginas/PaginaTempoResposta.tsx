import React from 'react'
import GraficoTempoResposta from '../components/graficos/GraficoTempoResposta'
import LayoutPagina from '../layout/LayoutPagina'
import { useTest } from '../contexto/ContextoTeste'

const PaginaTempoResposta: React.FC = () => {
  const { lastTest } = useTest()
  const chartData = lastTest?.durationMs ? [{ timestamp: lastTest.timestamp, response_time_ms: lastTest.durationMs }] : []
  return (
    <LayoutPagina>
      {chartData.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
          Sem dados de resposta ainda. Teste uma URL para gerar resultados.
          <div style={{ marginTop: '0.75rem' }}>
            <a href="/" style={{ color: '#2563eb' }}>Ir para Home</a>
          </div>
        </div>
      ) : (
        <GraficoTempoResposta data={chartData} />
      )}
    </LayoutPagina>
  )
}

export default PaginaTempoResposta
