import { Note, QuizResult, SubjectType, Flashcard, ProblemSolution, UserProfile, ClassLevel, StudySession } from '../types';

const KEYS = {
  NOTES: 'lumina_notes',
  QUIZ_RESULTS: 'lumina_quiz_results',
  FLASHCARDS: 'lumina_flashcards',
  CHAT_HISTORY: 'lumina_chat_history',
  USER_PROFILE: 'lumina_user_profile',
  MASTERED_CHAPTERS: 'lumina_mastered_chapters',
  ACTIVE_USER_ID: 'lumina_active_user_id',
  STUDY_SESSIONS: 'lumina_study_sessions'
};

export interface ChatSession {
  id: string;
  subject: SubjectType;
  query: string;
  solution: ProblemSolution;
  timestamp: number;
}

// Helper to get user-specific keys
const getUserKey = (key: string): string => {
  const userId = localStorage.getItem(KEYS.ACTIVE_USER_ID);
  return userId ? `${userId}_${key}` : key;
};

export const storageService = {
  // Generic helper to get data
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const scopedKey = getUserKey(key);
      const data = localStorage.getItem(scopedKey);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key}`, e);
      return defaultValue;
    }
  },

  // Generic helper to save data
  save: <T>(key: string, data: T): void => {
    try {
      const scopedKey = getUserKey(key);
      localStorage.setItem(scopedKey, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving ${key}`, e);
    }
  },

  // --- Auth helpers ---
  setActiveUser: (id: string) => localStorage.setItem(KEYS.ACTIVE_USER_ID, id),
  clearActiveUser: () => localStorage.removeItem(KEYS.ACTIVE_USER_ID),
  getActiveUserId: () => localStorage.getItem(KEYS.ACTIVE_USER_ID),

  // --- User Profile & Auth ---
  getUserProfile: (specificUserId?: string): UserProfile | null => {
    const userId = specificUserId || localStorage.getItem(KEYS.ACTIVE_USER_ID);
    if (!userId) return null;
    
    try {
      const data = localStorage.getItem(`${userId}_${KEYS.USER_PROFILE}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  
  saveUserProfile: (profile: UserProfile) => {
    storageService.setActiveUser(profile.id);
    localStorage.setItem(`${profile.id}_${KEYS.USER_PROFILE}`, JSON.stringify(profile));
  },

  updateUserClass: (classLevel: ClassLevel) => {
    const profile = storageService.getUserProfile();
    if (profile) {
      profile.classLevel = classLevel;
      storageService.saveUserProfile(profile);
    }
  },

  updateUserSubject: (subject: SubjectType) => {
    const profile = storageService.getUserProfile();
    if (profile) {
      profile.lastSelectedSubject = subject;
      storageService.saveUserProfile(profile);
    }
  },

  updateStreak: () => {
    const profile = storageService.getUserProfile();
    if (!profile) return;
    
    const today = new Date().toISOString().split('T')[0];
    const streak = profile.streak || { count: 0, lastActivityDate: '' };
    
    if (streak.lastActivityDate === today) return; // Already updated today
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (streak.lastActivityDate === yesterdayStr) {
      // Continued streak
      profile.streak = { count: streak.count + 1, lastActivityDate: today };
    } else {
      // Streak broken or new streak
      profile.streak = { count: 1, lastActivityDate: today };
    }
    
    storageService.saveUserProfile(profile);
  },

  updateDailyGoals: (goals: {id: string, text: string, completed: boolean}[]) => {
    const profile = storageService.getUserProfile();
    if (profile) {
      profile.dailyGoals = goals;
      storageService.saveUserProfile(profile);
    }
  },

  logoutUser: () => {
    storageService.clearActiveUser();
  },

  // --- Mastery & Progress ---
  getMasteredChapters: (): string[] => {
    return storageService.get<string[]>(KEYS.MASTERED_CHAPTERS, []);
  },

  markChapterMastered: (chapterId: string) => {
    const chapters = storageService.getMasteredChapters();
    if (!chapters.includes(chapterId)) {
      const updated = [...chapters, chapterId];
      storageService.save(KEYS.MASTERED_CHAPTERS, updated);
      
      // Also update profile if it exists for redundancy
      const profile = storageService.getUserProfile();
      if (profile) {
        profile.masteredChapters = updated;
        storageService.saveUserProfile(profile);
      }
    }
  },

  // Notes
  getNotes: (): Note[] => storageService.get<Note[]>(KEYS.NOTES, []),
  addNote: (note: Note) => {
    const notes = storageService.getNotes();
    storageService.save(KEYS.NOTES, [note, ...notes]);
  },
  deleteNote: (id: string) => {
    const notes = storageService.getNotes().filter(n => n.id !== id);
    storageService.save(KEYS.NOTES, notes);
  },

  // Quizzes
  getQuizResults: (): QuizResult[] => storageService.get<QuizResult[]>(KEYS.QUIZ_RESULTS, []),
  saveQuizResult: (result: QuizResult) => {
    const results = storageService.getQuizResults();
    storageService.save(KEYS.QUIZ_RESULTS, [result, ...results]);
  },
  
  // Flashcards
  getFlashcards: (): Flashcard[] => storageService.get<Flashcard[]>(KEYS.FLASHCARDS, []),
  saveFlashcards: (cards: Flashcard[]) => storageService.save(KEYS.FLASHCARDS, cards),
  
  // Chat History
  getChatHistory: (): ChatSession[] => storageService.get<ChatSession[]>(KEYS.CHAT_HISTORY, []),
  saveChatHistory: (session: ChatSession) => {
    const history = storageService.getChatHistory();
    const updated = [session, ...history].slice(0, 50);
    storageService.save(KEYS.CHAT_HISTORY, updated);
  },
  clearChatHistory: (subject?: SubjectType) => {
    if (subject) {
      const history = storageService.getChatHistory().filter(s => s.subject !== subject);
      storageService.save(KEYS.CHAT_HISTORY, history);
    } else {
      storageService.save(KEYS.CHAT_HISTORY, []);
    }
  },
  
  getMastery: (subject: SubjectType): number => {
    const results = storageService.getQuizResults().filter(r => r.subject === subject);
    if (results.length === 0) return 0;
    const total = results.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0);
    return Math.round((total / results.length) * 100);
  },

  // Study Sessions (Pomodoro)
  getStudySessions: (): StudySession[] => storageService.get<StudySession[]>(KEYS.STUDY_SESSIONS, []),
  saveStudySession: (session: StudySession) => {
    const sessions = storageService.getStudySessions();
    storageService.save(KEYS.STUDY_SESSIONS, [session, ...sessions]);
    // Updating activity also updates streak!
    storageService.updateStreak();
  },
  getTotalFocusTimeMinutes: (subject?: SubjectType): number => {
    const sessions = storageService.getStudySessions().filter(s => s.type === 'focus' && (!subject || s.subject === subject));
    return sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  }
};
