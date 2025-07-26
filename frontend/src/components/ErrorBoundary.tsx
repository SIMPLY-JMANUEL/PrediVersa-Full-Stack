import React from 'react';
import { ErrorInfo, ReactNode } from 'react';
import Button from './Button/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Enviar error a servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      // Aquí puedes integrar servicios como Sentry, LogRocket, etc.
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Integración con servicio de monitoreo
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      // Enviar a endpoint de logging
      fetch('http://localhost:5003/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      }).catch(console.error);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <h2>¡Oops! Algo salió mal</h2>
            <p>
              Ha ocurrido un error inesperado. Por favor, actualiza la página e
              intenta nuevamente.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                <summary>Detalles del error (solo en desarrollo)</summary>
                <p>
                  <strong>Error:</strong> {this.state.error?.message}
                </p>
                <p>
                  <strong>Stack trace:</strong>
                </p>
                <code>{this.state.error?.stack}</code>
                <p>
                  <strong>Component stack:</strong>
                </p>
                <code>{this.state.errorInfo?.componentStack}</code>
              </details>
            )}

            <div className="error-boundary__actions">
              <Button
                variant="primary"
                size="md"
                onClick={() => window.location.reload()}
              >
                Actualizar página
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => (window.location.href = '/')}
              >
                Ir al inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
