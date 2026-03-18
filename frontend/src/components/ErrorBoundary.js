import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo);
  }

  handleReload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-overlay">
          <div className="error-container">
            <h2 className="error-title">Oops! Something unexpected happened</h2>
            <p className="error-message">
              We're sorry for the inconvenience. Our team has been notified.
            </p>
            <div className="error-actions">
              <button className="btn-reload" onClick={this.handleReload}>
                Try Again
              </button>
              <a href="/" className="btn-home">Go Home</a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

