import React, { useEffect, useState } from 'react'
import styles from './ModalHistoricoBusca.module.css'
import { getHistory, toggleFavorite, removeSearch, clearHistory, SearchRecord } from '../../servicos/historicoBusca'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelect: (term: string) => void
}

const ModalHistoricoBusca: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  const [history, setHistory] = useState<SearchRecord[]>([])

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory())
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>Histórico de Pesquisas</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={styles.button} onClick={() => { clearHistory(); setHistory(getHistory()) }}>Limpar histórico</button>
            <button className={styles.button} onClick={onClose}>Fechar</button>
          </div>
        </div>

        <div className={styles.body}>
          {history.length === 0 ? (
            <div className={styles.meta}>Nenhuma busca registrada ainda.</div>
          ) : (
            <div className={styles.list}>
              {history.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div>
                    <div className={styles.term}>{item.term}</div>
                    <div className={styles.meta}>
                      {item.kind ?? 'all'} • vezes: {item.count} • última: {new Date(item.lastAt).toLocaleString()}
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.button} onClick={() => { onSelect(item.term) }}>Re-monitorar</button>
                    <button className={styles.button} onClick={() => { toggleFavorite(item.id); setHistory(getHistory()) }}>{item.favorite ? '★ Favorito' : '☆ Favoritar'}</button>
                    <button className={styles.button} onClick={() => { removeSearch(item.id); setHistory(getHistory()) }}>Remover</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalHistoricoBusca
