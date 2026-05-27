import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
            <div className="bg-bg-surface border border-border-default rounded-xl p-8 max-w-md w-full text-center">
              <p className="text-lg font-semibold text-text-primary mb-2">Something went wrong</p>
              <p className="text-sm text-text-muted mb-6">{this.state.message}</p>
              <button
                onClick={() => this.setState({ hasError: false, message: '' })}
                className="px-4 py-2 bg-accent text-white rounded-md text-sm hover:opacity-90 transition-opacity"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
