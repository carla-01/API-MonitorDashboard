import React, { useState } from 'react'
import { useQueryClient } from 'react-query'
import { fetchProxy } from '../servicos/api'
import ModalHistoricoBusca from '../components/modalhistorico/ModalHistoricoBusca'
import { addSearch } from '../servicos/historicoBusca'
import { useNavigate } from 'react-router-dom'
import { useTest } from '../contexto/ContextoTeste'

const HomePage: React.FC = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [testError, setTestError] = useState<string | null>(null)
  const [openHistory, setOpenHistory] = useState(false)
  const { setLastTest } = useTest()

  const runTest = async () => {
    const u = url.trim()
    if (!u) return
    setTesting(true)
    setTestError(null)
    setTestResult(null)
    try {
      const data = await fetchProxy(u)
      setTestResult(data)
      addSearch(u, 'url')
      setLastTest({
        url: u,
        status: data.status,
        headers: data.headers || {},
        durationMs: data.durationMs,
        timestamp: new Date().toISOString(),
      })
    } catch (e: any) {
      setTestError(e?.message || 'Erro ao testar URL')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>Home</h2>
      <section style={{ background: '#fff7ed', border: '1px solid #fde68a', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', color: '#92400e' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Aviso e Boas Práticas</div>
        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
          <li>Somente APIs públicas (sem autenticação).</li>
          <li>Respeitamos rate limits com delay entre requests.</li>
          <li>Não armazenamos conteúdo das APIs; exibimos metadados.</li>
          <li>Opt-out disponível para donos de APIs (negamos domínios configurados).</li>
          <li>Disclaimer: este teste não faz scraping de conteúdo.</li>
        </ul>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
        </div>
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', background: '#e5e7eb', cursor: 'pointer' }}
            onClick={() => setOpenHistory(true)}
          >
            Histórico
          </button>
        </div>
        <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Testar URL rapidamente</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              type="text"
              placeholder="https://example.com/api"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runTest() }}
            />
            <button
              style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', background: '#e5e7eb', cursor: 'pointer' }}
              onClick={runTest}
              disabled={testing}
            >
              {testing ? 'Testando...' : 'Testar'}
            </button>
            <button
              style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', background: '#f3f4f6', cursor: 'pointer' }}
              onClick={() => { setUrl(''); setTestResult(null); setTestError(null) }}
            >
              Limpar
            </button>
            <button
              style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', background: '#e5e7eb', cursor: 'pointer' }}
              onClick={() => { queryClient.invalidateQueries() }}
            >
              Atualizar
            </button>
          </div>

          {testError && <div style={{ color: '#b91c1c' }}>Erro: {testError}</div>}
          {testResult && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Status</h4>
                <div>Status: {testResult.status}</div>
                <div>Duração: {typeof testResult.durationMs === 'number' ? `${Math.round(testResult.durationMs)}ms` : '—'}</div>
                <div>Content-Type: {testResult.contentType || '—'}</div>
                <div>Tamanho: {Number(testResult.contentLength || 0)} bytes</div>
                {testResult.refusedContent && (
                  <div style={{ marginTop: '0.5rem', color: '#92400e' }}>
                    Conteúdo HTML detectado; corpo não foi retornado.
                  </div>
                )}
              </section>

              <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Headers</h4>
                <pre style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.375rem', padding: '0.75rem', overflowX: 'auto' }}>
                  {JSON.stringify(testResult.headers, null, 2)}
                </pre>
              </section>
            </div>
          )}
        </section>

        <ModalHistoricoBusca
          isOpen={openHistory}
          onClose={() => setOpenHistory(false)}
          onSelect={(term) => {
            setOpenHistory(false)
            addSearch(term)
            navigate(`/apis?search=${encodeURIComponent(term)}`)
          }}
        />
      </div>
    </div>
  )
}

export default HomePage
