import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Dumbbell, Calendar, LineChart, Menu, X } from 'lucide-react';
import WorkoutPage from './pages/WorkoutPage';
import SchedulePage from './pages/SchedulePage';
import ProgressPage from './pages/ProgressPage';
import LoginPage from './pages/LoginPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LogoutButton } from './components/LogoutButton';
import { UserProfile } from './components/UserProfile';

function App() {
  const [currentPage, setCurrentPage] = useState('workouts');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'workouts':
        return <WorkoutPage />;
      case 'schedule':
        return <SchedulePage />;
      case 'progress':
        return <ProgressPage />;
      default:
        return <WorkoutPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8" />
            <h1 className="text-2xl font-bold">FitTrack</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setCurrentPage('workouts')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${currentPage === 'workouts' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
            >
              <Dumbbell className="h-5 w-5" />
              <span>Workouts</span>
            </button>
            <button 
              onClick={() => setCurrentPage('schedule')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${currentPage === 'schedule' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
            >
              <Calendar className="h-5 w-5" />
              <span>Zeitplan</span>
            </button>
            <button 
              onClick={() => setCurrentPage('progress')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition ${currentPage === 'progress' ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
            >
              <LineChart className="h-5 w-5" />
              <span>Fortschritt</span>
            </button>
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-indigo-500">
              <UserProfile />
              <LogoutButton />
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <UserProfile />
            <button 
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-indigo-700 px-4 py-2">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => {
                  setCurrentPage('workouts');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition ${currentPage === 'workouts' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
              >
                <Dumbbell className="h-5 w-5" />
                <span>Workouts</span>
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('schedule');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition ${currentPage === 'schedule' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
              >
                <Calendar className="h-5 w-5" />
                <span>Zeitplan</span>
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('progress');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition ${currentPage === 'progress' ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`}
              >
                <LineChart className="h-5 w-5" />
                <span>Fortschritt</span>
              </button>
              <div className="pt-2 mt-2 border-t border-indigo-600">
                <LogoutButton />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 FitTrack. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;