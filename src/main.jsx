import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '32px', borderRadius: '16px', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', color: '#f87171' }}>
              Application Session Error
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '24px' }}>
              {this.state.error?.message || 'An unhandled error occurred.'}
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Reset Session & Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
