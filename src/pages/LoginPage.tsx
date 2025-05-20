import { useAuth0 } from '@auth0/auth0-react';
import { Dumbbell, Shield, UserCheck, Activity } from 'lucide-react';
import React from 'react';
import { LoginButton } from '../components/LoginButton';
import { LoadingSpinner } from '../components/LoadingSpinner';

const LoginPage: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left side - App info */}
        <div className="bg-indigo-50 p-8 md:p-12 md:w-1/2">
          <div className="flex items-center space-x-2 mb-8">
            <Dumbbell className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-indigo-600">FitTrack</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Verfolge deinen Fitnessfortschritt</h2>
          <p className="text-gray-600 mb-8">
            Schließe dich tausenden von Nutzern an, die mit FitTrack ihre Fitnessziele erreichen. 
            Protokolliere Workouts, verfolge Fortschritte und bleibe motiviert.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Activity className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Workouts aufzeichnen</h3>
                <p className="text-gray-600 text-sm">Protokolliere deine Übungen, Sätze, Wiederholungen und Gewichte</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <UserCheck className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Persönlicher Fortschritt</h3>
                <p className="text-gray-600 text-sm">Beobachte deine Verbesserungen im Laufe der Zeit</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Sicheres Konto</h3>
                <p className="text-gray-600 text-sm">Deine Daten sind privat und geschützt</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Login */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Willkommen zurück</h2>
          <p className="text-gray-600 mb-8">
            Melde dich an, um auf dein persönliches Fitness-Dashboard zuzugreifen
          </p>
          
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full">
              <LoginButton />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Mit der Anmeldung stimmst du unseren Nutzungsbedingungen und der Datenschutzerklärung zu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;