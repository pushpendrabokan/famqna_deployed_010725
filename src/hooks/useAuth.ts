import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AuthContextType } from '../types';

// This hook will use the real Firebase auth context
export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}