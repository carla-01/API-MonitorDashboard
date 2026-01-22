import React from 'react'
import styles from './BarraSuperior.module.css'
import { Link } from 'react-router-dom'

type BarraSuperiorProps = {
  title?: string
  onRefresh?: () => void
}

const BarraSuperior: React.FC<BarraSuperiorProps> = ({ title = 'API Monitor Dashboard', onRefresh }) => {
  const envMode = import.meta.env.MODE
  const apiUrl = import.meta.env.VITE_API_URL || '/api'

  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.titleRow}>
            <div className={styles.title}>{title}</div>
          </div>
          <div className={styles.nav}>
            <Link className={styles.navItem} to="/">Home</Link>
            <Link className={styles.navItem} to="/response-time">Tempo de Resposta</Link>
            <Link className={styles.navItem} to="/error-rate">Taxa de Erros</Link>
            <Link className={styles.navItem} to="/status-distribution">Distribuição de Status HTTP</Link>
            <Link className={styles.navItem} to="/percentiles">Latência</Link>
            <Link className={styles.navItem} to="/apis">APIs</Link>
            <Link className={styles.navItem} to="/alerts">Alertas</Link>
          </div>
        </div>
        <div className={styles.right}>
        </div>
      </div>
    </div>
  )
}

export default BarraSuperior
