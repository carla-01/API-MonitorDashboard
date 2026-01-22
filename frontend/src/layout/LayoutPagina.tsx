import React from 'react'
const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {children}
    </div>
  )
}

export default PageLayout
