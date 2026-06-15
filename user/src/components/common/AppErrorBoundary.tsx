'use client';

import React from 'react';
import { reportClientError } from '@lib/client-error-reporter';

interface State {
  hasError: boolean;
  message?: string;
}

export class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, message: error?.message || 'Đã xảy ra lỗi' };
  }

  componentDidCatch(error: any, info: React.ErrorInfo) {
    reportClientError({
      level: 'error',
      message: error?.message || 'React error boundary',
      stack: (error?.stack || '') + '\n' + (info?.componentStack || ''),
      metadata: { kind: 'react_error_boundary' }
    });
  }

  reset = () => this.setState({ hasError: false, message: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800">
          <div className="font-semibold mb-1">Đã xảy ra lỗi</div>
          <div className="text-sm mb-3">{this.state.message}</div>
          <button
            onClick={this.reset}
            className="px-3 py-1.5 text-sm rounded bg-rose-600 text-white hover:bg-rose-700"
          >
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
