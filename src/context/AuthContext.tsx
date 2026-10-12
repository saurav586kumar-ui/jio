import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, logoutUser, ADMIN_EMAIL, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isDemoUser: boolean;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  activateGuestMode: () => void;
  deactivateGuestMode: () => void;
  currentUserId: string;
  currentUserEmail: string;
  currentUserName: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isDemoUser: false,
  signInGoogle: async () => {},
  signOut: async () => {},
  activateGuestMode: () => {},
  deactivateGuestMode: () => {},
  currentUserId: 'anonymous',
  currentUserEmail: '',
  currentUserName: 'Guest Student',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdminState, setIsAdminState] = useState<boolean>(false);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsDemoUser(false);
        const emailMatches = currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        if (emailMatches) {
          setIsAdminState(true);
        } else {
          // Check if registered in /admins/{uid}
          try {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            setIsAdminState(adminDoc.exists());
          } catch {
            setIsAdminState(false);
          }
        }
      } else {
        setIsAdminState(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google Sign In error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setIsDemoUser(false);
      setIsAdminState(false);
    } catch (err) {
      console.error('Sign Out error:', err);
    } finally {
      setLoading(false);
    }
  };

  const activateGuestMode = () => {
    setIsDemoUser(true);
  };

  const deactivateGuestMode = () => {
    setIsDemoUser(false);
  };

  const currentUserId = user?.uid || (isDemoUser ? 'demo-student-uid' : 'guest-uid');
  const currentUserEmail = user?.email || (isDemoUser ? 'student@edsu.org' : '');
  const currentUserName = user?.displayName || (isDemoUser ? 'Student Scholar' : 'Student Guest');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: isAdminState,
        isDemoUser,
        signInGoogle,
        signOut,
        activateGuestMode,
        deactivateGuestMode,
        currentUserId,
        currentUserEmail,
        currentUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
