import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { router } from './router';
import { AuthProvider } from '../features/auth/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';

export default function AppProviders({ children }: PropsWithChildren) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 30,
      },
    },
  }));

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <ErrorBoundary>
          {children ?? <RouterProvider router={router} />}
        </ErrorBoundary>
      </AuthProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
