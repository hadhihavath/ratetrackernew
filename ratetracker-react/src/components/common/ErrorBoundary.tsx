import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    // Could send to error reporting service here
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    toast.success('Retrying...', { icon: '🔄' })
  }

  handleGoHome = () => {
    const navigate = useNavigate()
    navigate('/')
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-danger-bg flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-danger" />
          </div>
          <h2 className="text-xl font-extrabold text-text-main mb-2">Something went wrong</h2>
          <p className="text-text-muted mb-6 max-w-md">
            We encountered an unexpected error. Our team has been notified.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mx-auto">
            <button
              onClick={this.handleRetry}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={this.handleGoHome}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 w-full max-w-md mx-auto text-left">
              <summary className="text-sm text-text-muted cursor-pointer">Error Details</summary>
              <pre className="mt-2 p-3 bg-bg-subtle rounded-lg text-xs overflow-auto text-text-secondary">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}