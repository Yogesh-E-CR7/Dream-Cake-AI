import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enterprise React Error Boundary
 * Catches JavaScript rendering errors anywhere in child component tree,
 * logs error diagnostics, and presents a graceful branded recovery UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // In production, send to telemetry / Sentry / CloudWatch
    console.error('[DreamCake ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[380px] w-full flex items-center justify-center p-6 bg-cream-50 rounded-2xl border border-rose-100 shadow-sm my-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center border border-rose-200">
              <AlertTriangle className="w-7 h-7 text-rose-600 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-chocolate-900">
                {this.props.fallbackTitle || 'Something went wrong in the Cake Studio'}
              </h3>
              <p className="text-xs text-chocolate-600">
                {this.props.fallbackDescription ||
                  'A rendering error occurred while composing the cake studio canvas or executing a state transition.'}
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-white p-3 rounded-lg border border-chocolate-100 text-[11px] font-mono text-rose-700 max-h-28 overflow-y-auto">
                <span className="font-semibold block mb-1">Error Message:</span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReset}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Try Again
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={this.handleGoHome}
                leftIcon={<Home className="w-3.5 h-3.5" />}
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
