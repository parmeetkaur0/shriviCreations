import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
          <div>
            <h2 className="font-display text-3xl mb-3">Something went off-stitch</h2>
            <p className="text-ink/60 mb-6 max-w-md mx-auto">
              We hit an unexpected snag loading this page. Try refreshing, or head back home.
            </p>
            <button onClick={() => window.location.assign('/')} className="btn-primary">
              Back to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
