import { useAuth0 } from '@auth0/auth0-react';
import { LogIn } from 'lucide-react';
import React from 'react';

export const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
      onClick={() => loginWithRedirect()}
    >
      <LogIn className="h-5 w-5" />
      <span>Log In</span>
    </button>
  );
};