import React from 'react'
import styles from './PainelAlertas.module.css'

type Props = { alerts: any[] }

const PainelAlertas: React.FC<Props> = ({ alerts = [] }) => {
  return (
    <div className={`${styles.container} bg-white p-4 rounded shadow`}>
      <h2 className="text-lg font-semibold mb-4">Alertas</h2>
      {alerts.length === 0 ? (
        <p className={`${styles.emptyState} text-gray-500`}>Sem alertas</p>
      ) : (
        <ul className={`${styles.list} list-disc pl-5`}>
          {alerts.map((a, i) => (
            <li key={i}>{a.message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PainelAlertas
