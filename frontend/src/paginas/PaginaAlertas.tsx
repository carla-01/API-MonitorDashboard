import React from 'react'
import PainelAlertas from '../components/usual/PainelAlertas'
import LayoutPagina from '../layout/LayoutPagina'
import { useTest } from '../contexto/ContextoTeste'

const PaginaAlertas: React.FC = () => {
  const { lastTest } = useTest()
  const LATENCY_THRESHOLD_MS = 1000
  const alerts = !lastTest ? [] : [
    ...(lastTest.durationMs && lastTest.durationMs >= LATENCY_THRESHOLD_MS ? [{ message: `Latência alta: ${Math.round(lastTest.durationMs)}ms`, level: 'warning' as const }] : []),
    ...(lastTest.status >= 400 ? [{ message: `Erro HTTP: ${lastTest.status}`, level: 'critical' as const }] : [])
  ]
  return (
    <LayoutPagina>
      {!lastTest ? (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
          Sem alertas. Teste uma URL na Home para gerar resultados.
          <div style={{ marginTop: '0.75rem' }}>
            <a href="/" style={{ color: '#2563eb' }}>Ir para Home</a>
          </div>
        </div>
      ) : (
        <PainelAlertas alerts={alerts} />
      )}
    </LayoutPagina>
  )
}

export default PaginaAlertas
