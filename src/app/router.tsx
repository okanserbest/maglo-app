import { createBrowserRouter, Navigate } from 'react-router-dom';
import SignInPage from '../pages/auth/SignInPage';
import SignUpPage from '../pages/auth/SignUpPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import { PrivateRoute, PublicOnlyRoute } from './guards';
import AppLayout from '../components/layout/AppLayout';
import DesignReference from '../pages/tools/DesignReference';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/signin" replace /> },
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/signin', element: <SignInPage /> },
      { path: '/signup', element: <SignUpPage /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
              { path: '/tools/design-ref', element: <DesignReference /> },
        ],
      },
    ],
  },
]);
