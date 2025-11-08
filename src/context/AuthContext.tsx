/**
 * Authentication Context
 * Manages authentication state across the app
 */

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authService, firestoreService } from '../services/firebase';
import { storageService } from '../services/storage';
import { User, UserRole } from '../models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithPin: (username: string, pin: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  userRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state
   * Checks for existing session in AsyncStorage
   */
  const initializeAuth = async () => {
    try {
      // Check for stored user session
      const storedUserJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      
      if (storedUserJson) {
        const storedUser: User = JSON.parse(storedUserJson);
        
        // For Firebase users, verify the session is still valid
        if (storedUser.role === UserRole.CVIF || storedUser.role === UserRole.PHILOS) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            // Session is valid, restore user
            setUser(storedUser);
          } else {
            // Session expired, clear storage
            await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
          }
        } else {
          // BHW user - restore from storage
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with email and password (CVIF and PHILOS users)
   */
  const signIn = async (email: string, password: string) => {
    try {
      // Authenticate with Firebase
      const firebaseUser = await authService.signInWithEmail(email, password);
      
      // Store user in state and AsyncStorage
      setUser(firebaseUser);
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(firebaseUser));
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  /**
   * Sign in with username and PIN (BHW users)
   */
  const signInWithPin = async (username: string, pin: string) => {
    try {
      // Get stored user by email (username is email for BHWs) from AsyncStorage
      const storedUsersJson = await AsyncStorage.getItem(STORAGE_KEYS.BHW_USERS);
      
      if (!storedUsersJson) {
        throw new Error('No BHW users found. Please contact your coordinator.');
      }

      const storedUsers: User[] = JSON.parse(storedUsersJson);
      const bhwUser = storedUsers.find(u => u.email === username);

      if (!bhwUser) {
        throw new Error('Username not found');
      }

      // Verify PIN (stored hashed in the pin field for BHW users)
      const hashedPin = await hashPin(pin);
      if ((bhwUser as any).pin !== hashedPin) {
        throw new Error('Incorrect PIN');
      }

      // Update last login
      (bhwUser as any).lastLoginAt = new Date();
      
      // Update in storage
      const updatedUsers = storedUsers.map(u => 
        u.id === bhwUser.id ? bhwUser : u
      );
      await AsyncStorage.setItem(STORAGE_KEYS.BHW_USERS, JSON.stringify(updatedUsers));

      // Set as current user
      setUser(bhwUser);
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(bhwUser));
    } catch (error: any) {
      console.error('PIN sign in error:', error);
      throw new Error(error.message || 'Failed to sign in with PIN');
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    try {
      // Sign out from Firebase if applicable
      if (user?.role === UserRole.CVIF || user?.role === UserRole.PHILOS) {
        await authService.signOut();
      }

      // Clear user from state and storage
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  };

  /**
   * Simple PIN hashing (for development)
   * In production, use a proper hashing library like bcrypt
   */
  const hashPin = async (pin: string): Promise<string> => {
    // Simple hash for development (reverse string as hash)
    // In production, use: bcrypt.hash(pin, 10)
    return pin.split('').reverse().join('');
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signInWithPin,
    signOut,
    isAuthenticated: !!user,
    userRole: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
