import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface ProtectedRouteProps {
  component: React.ComponentType;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <LoadingSpinner />,
  });

  return <Component />;
};