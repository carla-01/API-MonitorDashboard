import React from 'react'

type Props = { percentiles: { p50: number; p90: number; p95: number; p99: number } }

const CartaoPercentis: React.FC<Props> = ({ percentiles }) => {
  const items = [
    { label: 'p50', value: percentiles?.p50 ?? 0 },
    { label: 'p90', value: percentiles?.p90 ?? 0 },
    { label: 'p95', value: percentiles?.p95 ?? 0 },
    { label: 'p99', value: percentiles?.p99 ?? 0 }
  ]
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Latência</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.label} className="bg-gray-50 rounded p-3 text-center">
            <div className="text-sm text-gray-500">{it.label}</div>
            <div className="text-xl font-semibold">{Math.round(it.value)} ms</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CartaoPercentis
