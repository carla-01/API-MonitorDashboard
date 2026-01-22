import React from 'react'
import GraficoTaxaErros from '../components/graficos/GraficoTaxaErros'
import LayoutPagina from '../layout/LayoutPagina'
import { useTest } from '../contexto/ContextoTeste'

const PaginaTaxaErros: React.FC = () => {
  const { lastTest } = useTest()
  const overTime = lastTest ? [{ timestamp: lastTest.timestamp, error_rate: lastTest.status >= 400 ? 1 : 0 }] : []
  return (
    <LayoutPagina>
      {!overTime || overTime.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
          Sem dados de taxa de erro ainda. Teste uma URL para gerar resultados.
          <div style={{ marginTop: '0.75rem' }}>
            <a href="/" style={{ color: '#2563eb' }}>Ir para Home</a>
          </div>
        </div>
      ) : (
        <GraficoTaxaErros data={overTime} />
      )}
    </LayoutPagina>
  )
}

export default PaginaTaxaErros
