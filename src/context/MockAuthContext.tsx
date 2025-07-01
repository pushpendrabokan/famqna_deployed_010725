import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { mockCreators } from '../data/mockData';

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: 'mock-user-1',
    name: 'Pushpendra Bokan',
    email: 'pushpendragurjareg21@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    username: 'pushpendra-b2k3m',
    bio: 'Software developer and creator. I help people learn to code and advance their careers.',
  },
  ...mockCreators.map(creator => ({
    id: creator.id,
    name: creator.name,
    email: creator.email,
    photoURL: creator.photoURL,
    username: creator.username,
    bio: creator.bio
  }))
];

const MockAuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useMockAuth = () => useContext(MockAuthContext);

export const MockAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock Google sign in
  const signInWithGoogle = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Use the first mock user
    setCurrentUser(MOCK_USERS[0]);
    return MOCK_USERS[0];
  };

  // Mock sign out
  const signOut = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {!loading && children}
    </MockAuthContext.Provider>
  );
};