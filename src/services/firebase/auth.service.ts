/**
 * Firebase Authentication Service
 * Handles user authentication operations
 */

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase.init';
import { firestoreService } from './firestore.service';
import { User, UserRole } from '../../models';

class AuthService {
  private auth = getFirebaseAuth();

  /**
   * Sign in with email and password (for CVIF and PHILOS users)
   */
  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userData = await firestoreService.getUser(firebaseUser.uid);
      
      if (!userData) {
        throw new Error('User data not found in database');
      }
      
      console.log('✅ User signed in:', userData.email);
      return userData;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with username (for BHW users)
   * Note: This will be enhanced in Step 08 with PIN authentication
   */
  async signInWithUsername(username: string): Promise<User | null> {
    try {
      // For now, return null - will be implemented in Step 08
      console.log('BHW sign in with username:', username);
      return null;
    } catch (error) {
      console.error('❌ Username sign in error:', error);
      throw error;
    }
  }

  /**
   * Create new user account
   */
  async createUser(
    email: string,
    password: string,
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<User> {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      });

      // Create user document in Firestore
      const newUser = {
        id: firebaseUser.uid,
        ...userData,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      await firestoreService.saveUser(newUser);
      console.log('✅ User created:', email);
      return newUser;
    } catch (error) {
      console.error('❌ Create user error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Create user with email and password (returns Firebase user credential)
   */
  async createUserWithEmail(email: string, password: string): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('✅ Firebase user created:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('❌ Create user with email error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('✅ User signed out');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('✅ Password reset email sent to:', email);
    } catch (error) {
      console.error('❌ Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current Firebase user
   */
  getCurrentFirebaseUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  /**
   * Get current user (alias for getCurrentFirebaseUser)
   */
  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  /**
   * Handle Firebase Auth errors with user-friendly messages
   */
  private handleAuthError(error: any): Error {
    let message = 'Authentication error occurred';

    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password';
          break;
        case 'auth/email-already-in-use':
          message = 'Email address is already in use';
          break;
        case 'auth/weak-password':
          message = 'Password is too weak';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your connection';
          break;
        default:
          message = error.message || message;
      }
    }

    return new Error(message);
  }
}

// Export singleton instance
export const authService = new AuthService();
