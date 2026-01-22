import React from 'react'

type ErrorBoundaryState = { hasError: boolean; error?: unknown }
type ErrorBoundaryProps = { children: React.ReactNode }

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false }
  public props!: Readonly<ErrorBoundaryProps>

  constructor(props: ErrorBoundaryProps) {
    super(props)
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem' }}>
          <h2>Algo deu errado</h2>
          <p>Tente voltar para a página inicial ou recarregar.</p>
        </div>
      )
    }
    return this.props.children
  }
}
