import React from 'react'
import './footer.css'

const Rodape: React.FC = () => {
  const year = new Date().getFullYear()
  const envMode = import.meta.env.MODE

  return (
    <footer className="footer">
      <div className="container">
        <div>
          © {year} API Monitor 
        </div>
        <div className="links">
        </div>
      </div>
    </footer>
  )
}

export default Rodape
