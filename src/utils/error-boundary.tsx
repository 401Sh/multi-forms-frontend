import * as React from 'react'
import logger from './logger'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Обновляем состояние, чтобы отрендерить запасной UI
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.debug(
      error,
      info.componentStack ?? 'No component stack available'
      // React.captureOwnerStack() — это внутренняя функция, отсутствующая в публичном API
      // Если ты точно знаешь, что она у тебя есть, можешь оставить.
      // Но чаще всего её следует убрать или заменить.
      // @ts-ignore
    )
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

export default ErrorBoundary
