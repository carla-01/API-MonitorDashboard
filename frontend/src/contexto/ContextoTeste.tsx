import React, { createContext, useContext, useState } from 'react'

export type TestResult = {
  url: string
  status: number
  headers: Record<string, any>
  data?: unknown
  durationMs?: number
  timestamp: string
}

type Ctx = {
  lastTest: TestResult | null
  setLastTest: (r: TestResult | null) => void
}

const TestContext = createContext<Ctx | undefined>(undefined)

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastTest, setLastTest] = useState<TestResult | null>(null)
  return (
    <TestContext.Provider value={{ lastTest, setLastTest }}>
      {children}
    </TestContext.Provider>
  )
}

export function useTest() {
  const ctx = useContext(TestContext)
  if (!ctx) throw new Error('useTest must be used within TestProvider')
  return ctx
}
