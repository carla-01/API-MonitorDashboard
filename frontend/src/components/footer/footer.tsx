import React from 'react'
import styles from './Rodape.module.css'

const Rodape: React.FC = () => {
  const year = new Date().getFullYear()
  const envMode = import.meta.env.MODE

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          © {year} API Monitor 
        </div>
        <div className={styles.links}>
        </div>
      </div>
    </footer>
  )
}

export default Rodape
