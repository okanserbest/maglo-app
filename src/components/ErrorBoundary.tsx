import React from 'react';

type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any): State {
    return { hasError: true, message: error?.message };
  }
  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h1 className="text-xl font-semibold">Bir şeyler ters gitti</h1>
          <p className="text-sm text-gray-600 mt-2">{this.state.message ?? 'Unexpected error'}</p>
          <button className="mt-4 rounded border px-3 py-1" onClick={() => this.setState({ hasError: false })}>
            Tekrar dene
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
