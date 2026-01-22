import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchProxy, ProxyResponse } from '../servicos/api'
import LayoutPagina from '../layout/LayoutPagina'
import { useLocation } from 'react-router-dom'
import { useTest } from '../contexto/ContextoTeste'

const ApisPage: React.FC = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const q = (params.get('search') || '').trim().toLowerCase()
  const isUrl = /^https?:\/\//i.test(q)

  const { data: proxyResult, error, status } = useQuery<ProxyResponse>({
    queryKey: ['proxy', q],
    queryFn: () => fetchProxy(q),
    enabled: isUrl && !!q,
    retry: false,
  })
  const { lastTest } = useTest()
  const testedUrlCard = lastTest ? (
    <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>API Testada</h3>
      <div style={{ marginBottom: '0.25rem' }}>URL: {lastTest.url}</div>
      <div style={{ marginBottom: '0.25rem' }}>Status: {lastTest.status}</div>
      <div style={{ marginBottom: '0.25rem' }}>Versão: {lastTest.headers['x-api-version'] || lastTest.headers['x-version'] || lastTest.headers['server'] || 'Indisponível'}</div>
    </div>
  ) : null
  return (
    <LayoutPagina>
      {status === 'error' && (
        <div style={{ background: '#fff7ed', border: '1px solid #fde68a', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', color: '#92400e' }}>
          Falha ao consultar API: {String((error as any)?.message || 'erro desconhecido')}
        </div>
      )}
      {testedUrlCard}
      {isUrl && proxyResult && (
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Teste de URL</h3>
          <div style={{ marginBottom: '0.25rem', color: '#374151' }}>Status: {proxyResult.status}</div>
          <div style={{ marginBottom: '0.25rem', color: '#374151' }}>Duração: {typeof proxyResult.durationMs === 'number' ? `${Math.round(proxyResult.durationMs)}ms` : '—'}</div>
          <div style={{ marginBottom: '0.5rem', color: '#374151' }}>Content-Type: {proxyResult.contentType || '—'} | Tamanho: {Number(proxyResult.contentLength || 0)} bytes</div>
          {proxyResult.refusedContent && (
            <div style={{ marginBottom: '0.5rem', color: '#92400e' }}>
              Conteúdo HTML detectado; corpo não foi retornado.
            </div>
          )}
          <details>
            <summary style={{ cursor: 'pointer', color: '#2563eb' }}>Headers</summary>
            <pre style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.375rem', padding: '0.75rem', overflowX: 'auto' }}>
              {JSON.stringify(proxyResult.headers, null, 2)}
            </pre>
          </details>
        </div>
      )}
      {!isUrl && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
          Digite uma URL pública na busca para testar.
        </div>
      )}
    </LayoutPagina>
  )
}

export default ApisPage
