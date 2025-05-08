import { useAuth0 } from '@auth0/auth0-react';
import { User } from 'lucide-react';
import React from 'react';

export const UserProfile: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {user.picture ? (
        <img 
          src={user.picture} 
          alt={user.name || 'User'} 
          className="h-8 w-8 rounded-full border-2 border-white"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center">
          <User className="h-4 w-4 text-indigo-600" />
        </div>
      )}
      <span className="text-sm font-medium text-white hidden md:block">
        {user.name || user.email}
      </span>
    </div>
  );
};