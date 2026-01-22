import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './GraficoTempoResposta.module.css'

type Props = { data: any[] }

const GraficoTempoResposta: React.FC<Props> = ({ data = [] }) => {
  return (
    <div className={`${styles.container} bg-white p-4 rounded shadow`}>
      <h2 className={`${styles.title} text-lg font-semibold mb-4`}>Tempo de Resposta</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="response_time_ms" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoTempoResposta
