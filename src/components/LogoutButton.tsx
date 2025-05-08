import { useAuth0 } from '@auth0/auth0-react';
import { LogOut } from 'lucide-react';
import React from 'react';

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <button
      className="flex items-center space-x-2 text-white hover:bg-indigo-700 px-3 py-2 rounded-md transition"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    >
      <LogOut className="h-5 w-5" />
      <span>Log Out</span>
    </button>
  );
};