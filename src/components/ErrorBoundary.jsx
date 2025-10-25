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
        <div className="w-28 h-28 flex items-center justify-center bg-tertiary rounded-full border-2 border-[#2563eb]">
          <span className="text-white text-xs text-center px-2 font-medium">
            {this.props.fallbackText || 'Tech'}
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; // Error boundary implementation
