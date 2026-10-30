import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/query-client';
import { getStoredTokens, setStoredTokens } from './lib/axios';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const tokens = getStoredTokens();
    return !!tokens?.accessToken;
  });

  useEffect(() => {
    // Sync authentication state across browser storage events
    const handleStorageChange = () => {
      const tokens = getStoredTokens();
      setIsAuthenticated(!!tokens?.accessToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setStoredTokens(null);
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        dir="rtl"
        position="top-center"
        richColors
        closeButton
      />

      {isAuthenticated ? (
        <AdminDashboardPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </QueryClientProvider>
  );
}

export default App;
