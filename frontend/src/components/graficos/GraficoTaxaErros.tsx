import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Props = { data: { timestamp: string; error_rate: number }[] }

const GraficoTaxaErros: React.FC<Props> = ({ data = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Taxa de Erros ao Longo do Tempo</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`} />
          <Line type="monotone" dataKey="error_rate" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoTaxaErros
