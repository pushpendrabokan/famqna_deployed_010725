import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthProvider } from './AuthContext';
import { MockAuthProvider } from './MockAuthContext';
import { AuthContextType } from '../types';

// Create a context for the authentication mode
type AuthModeContextType = {
  useMockAuth: boolean;
  toggleAuthMode: () => void;
};

const AuthModeContext = createContext<AuthModeContextType>({
  useMockAuth: false,
  toggleAuthMode: () => {},
});

// Export a hook to use the auth mode
export const useAuthMode = () => useContext(AuthModeContext);

// AuthSwitcher component that will wrap the application
export const AuthSwitcher: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check localStorage for a stored preference, default to true for the mock auth
  const [useMockAuth, setUseMockAuth] = useState<boolean>(() => {
    const stored = localStorage.getItem('useMockAuth');
    return stored ? stored === 'true' : true;
  });

  // Toggle between real and mock authentication
  const toggleAuthMode = () => {
    const newValue = !useMockAuth;
    setUseMockAuth(newValue);
    localStorage.setItem('useMockAuth', String(newValue));
  };

  // Provide the auth mode context
  return (
    <AuthModeContext.Provider value={{ useMockAuth, toggleAuthMode }}>
      {useMockAuth ? (
        <MockAuthProvider>{children}</MockAuthProvider>
      ) : (
        <AuthProvider>{children}</AuthProvider>
      )}
    </AuthModeContext.Provider>
  );
};