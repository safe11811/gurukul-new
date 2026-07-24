import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ClassLevel, SubjectType } from '../types';
import { storageService } from '../services/storageService';
import { auth } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateClassLevel: (level: ClassLevel) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light' | 'neo-brutalism') => void;
  updateDailyGoals: (goals: {id: string, text: string, completed: boolean}[]) => void;
  updateStreak: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default Presets to ensure Science users don't see Commerce subjects
const DEFAULT_SCIENCE_SUBJECTS = [
  SubjectType.PHYSICS, 
  SubjectType.CHEMISTRY, 
  SubjectType.MATH, 
  SubjectType.BIOLOGY, 
  SubjectType.ENGLISH, 
  SubjectType.CS
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load synchronously first to prevent flash
  const [user, setUser] = useState<UserProfile | null>(() => storageService.getUserProfile());
  const [isLoading, setIsLoading] = useState(true);

  // Apply Theme Side-effect
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'neo-brutalism');

    if (user?.preferences?.theme) {
      if (user.preferences.theme === 'dark') {
        root.classList.add('dark');
      } else if (user.preferences.theme === 'neo-brutalism') {
        root.classList.add('neo-brutalism');
      }
    } else {
      // Default to dark if no user
      root.classList.add('dark');
    }
  }, [user?.preferences?.theme]);

  useEffect(() => {
    let unsubscribe: () => void;

    const initAuth = async () => {
      // 1. Check for local simulated user (Guest)
      const stored = storageService.getUserProfile();
      if (stored && stored.id.startsWith('g-simulated')) {
        setUser(stored);
        setIsLoading(false);
        return;
      }

      // 2. Listen to Firebase Auth
      if (auth) {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            // Get existing profile or create new one
            const currentProfile = storageService.getUserProfile(firebaseUser.uid);
            
            const profile: UserProfile = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
              // Persist existing settings or default to Grade 11 Science
              classLevel: currentProfile?.classLevel || 'Grade 11',
              stream: currentProfile?.stream || 'Science',
              subjects: currentProfile?.subjects || DEFAULT_SCIENCE_SUBJECTS,
              lastSelectedSubject: currentProfile?.lastSelectedSubject || SubjectType.PHYSICS,
              preferences: currentProfile?.preferences || { theme: 'dark' },
              masteredChapters: currentProfile?.masteredChapters || []
            };
            
            setUser(profile);
            storageService.saveUserProfile(profile);
          } else {
            // Only clear if we aren't using a guest account
            if (!storageService.getActiveUserId()?.startsWith('g-simulated')) {
               setUser(null);
            }
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    };
    
    initAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, []);

  const simulateLogin = () => {
    const mockUser: UserProfile = {
      id: 'g-simulated-' + Date.now(),
      name: 'Guest User',
      email: 'guest@demo.com',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
      classLevel: 'Grade 11',
      stream: 'Science',
      subjects: DEFAULT_SCIENCE_SUBJECTS, // Default to Science
      lastSelectedSubject: SubjectType.PHYSICS,
      preferences: { theme: 'dark' },
      masteredChapters: []
    };
    storageService.saveUserProfile(mockUser);
    setUser(mockUser);
  };

  const login = async () => {
    setIsLoading(true);
    if (auth) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // onAuthStateChanged will handle setting the user
      } catch (error: any) {
        console.warn("Google Sign In Error:", error);
        
        if (error.code === 'auth/unauthorized-domain') {
           console.info("Domain unauthorized. Falling back to Guest Mode automatically.");
           simulateLogin();
        } else if (error.code === 'auth/popup-closed-by-user') {
           setIsLoading(false);
        } else if (error.code === 'auth/operation-not-allowed') {
           alert("Google Sign-In is not enabled. Using Guest Mode.");
           simulateLogin();
        } else {
           alert("Login failed. Using Guest Mode.");
           simulateLogin();
        }
      }
    } else {
      console.warn("Auth service not available, using simulation");
      simulateLogin();
    }
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      if (auth) await signOut(auth);
    } catch (e) {
      console.error("Sign out error", e);
    }
    storageService.logoutUser();
    setUser(null);
  };

  const updateClassLevel = (level: ClassLevel) => {
    if (user) {
      const updated = { ...user, classLevel: level };
      storageService.saveUserProfile(updated);
      setUser(updated);
    }
  };

  const setTheme = (theme: 'dark' | 'light' | 'neo-brutalism') => {
    if (user) {
      const updated = { ...user, preferences: { ...user.preferences, theme } };
      storageService.saveUserProfile(updated);
      setUser(updated);
    }
  };

  const toggleTheme = () => {
    if (user) {
      const current = user.preferences.theme;
      const nextTheme = current === 'dark' ? 'light' : current === 'light' ? 'neo-brutalism' : 'dark';
      setTheme(nextTheme);
    }
  };

  const updateDailyGoals = (goals: {id: string, text: string, completed: boolean}[]) => {
    if (user) {
      const updated = { ...user, dailyGoals: goals };
      storageService.saveUserProfile(updated);
      setUser(updated);
    }
  };

  const updateStreak = () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const streak = user.streak || { count: 0, lastActivityDate: '' };
    
    if (streak.lastActivityDate === today) return; // Already updated today
    
    let newStreakCount = 1;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (streak.lastActivityDate === yesterdayStr) {
      newStreakCount = streak.count + 1;
    }
    
    const updated = { ...user, streak: { count: newStreakCount, lastActivityDate: today } };
    storageService.saveUserProfile(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateClassLevel, toggleTheme, setTheme, updateDailyGoals, updateStreak, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
