import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User, AuthContextType } from '../types';
import { generateUsername } from '../utils/username';
import emailService from '../services/EmailService';

const googleProvider = new GoogleAuthProvider();

// Create and export the AuthContext
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Get or create user data
  const getUserData = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User;
    }
    
    // Create new user data
    const userData: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Anonymous',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || 'https://via.placeholder.com/150',
      username: generateUsername(firebaseUser.email || ''),
    };
    
    // Store in Firestore
    await setDoc(userRef, userData);
    
    // Send welcome email for new users
    if (userData.email) {
      try {
        await emailService.sendWelcomeEmail(
          userData.id,
          userData.email,
          userData.name
        );
        console.log('Welcome email sent to:', userData.email);
      } catch (error) {
        console.error('Error sending welcome email:', error);
      }
    }
    
    return userData;
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<User | void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = await getUserData(result.user);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user);
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};