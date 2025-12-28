import  { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  
    fetch('https://traceops.onrender.com/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'ERROR',
        serviceName: 'plinko-challenge-frontend',
        message: error.message,
        metadata: {
          componentStack: errorInfo.componentStack,
          stack: error.stack,
          source: 'react-error-boundary'
        }
      })
    }).catch(() => {
      // fail silently — observability must never break UX
    });
  }
  
  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or contact support if the problem persists.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

