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
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Something went wrong
            </h4>
            <p>An unexpected error occurred. Please refresh the page and try again.</p>
            {this.state.error && (
              <details className="mt-3">
                <summary>Error details</summary>
                <pre className="mt-2 small">{this.state.error.toString()}</pre>
              </details>
            )}
            <hr />
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/'}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
