export enum SubjectType {
  // Core / Science
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  MATH = 'Mathematics',
  BIOLOGY = 'Biology',
  CS = 'Computer Science',
  ENGLISH = 'English',
  
  // Commerce
  ACCOUNTANCY = 'Accountancy',
  BUSINESS_STUDIES = 'Business Studies',
  ECONOMICS = 'Economics',
  ENTREPRENEURSHIP = 'Entrepreneurship',
  APPLIED_MATH = 'Applied Mathematics',
  IP = 'Informatics Practices',

  // Humanities / Arts
  POLITICAL_SCIENCE = 'Political Science',
  HISTORY = 'History',
  PSYCHOLOGY = 'Psychology',
  LEGAL_STUDIES = 'Legal Studies',
  PHYSICAL_EDUCATION = 'Physical Education',
  COMMERCIAL_ARTS = 'Commercial Arts'
}

export type ClassLevel = 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12' | 'University';

export type StreamType = 'Science' | 'Commerce' | 'Humanities' | 'Custom';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  classLevel: ClassLevel;
  stream: StreamType;
  subjects: SubjectType[]; 
  lastSelectedSubject?: SubjectType; // Added for smart memory
  preferences: {
    theme: 'dark' | 'light' | 'neo-brutalism';
  };
  masteredChapters?: string[];
  streak?: {
    count: number;
    lastActivityDate: string; // YYYY-MM-DD
  };
  dailyGoals?: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  topics: string[];
}

export interface SubjectConfig {
  id: SubjectType;
  color: string;
  bg: string;
  border: string;
  icon: any;
  description: string;
  themeColor: string;
}

export interface SubjectDetailConfig {
  actionLabel: string;
  placeholder: string;
  tools: string[];
  chatExamples: string[];
  quizTypes: string[];
  notePlaceholder: string;
}

export interface FlowchartStep {
  id: string;
  label: string;
  description: string;
  type: 'concept' | 'formula' | 'action' | 'result' | 'decision';
  connections: string[];
  why?: string;
}

export interface ProblemSolution {
  problemStatement: string;
  steps: FlowchartStep[];
  finalAnswer: string;
  tips: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Competitive' | 'Elite';

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'mcq' | 'boolean' | 'short_answer' | 'match' | 'assertion';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: DifficultyLevel;
  tags: string[];
}

export interface QuizResult {
  id: string;
  subject: SubjectType;
  score: number;
  totalQuestions: number;
  date: number;
  answers: { 
    questionId: string; 
    userAnswer: string; 
    isCorrect: boolean;
    questionText?: string;
    correctAnswer?: string;
    explanation?: string;
  }[];
  difficulty: DifficultyLevel;
  topics?: string[];
  classLevel?: ClassLevel;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: SubjectType;
  date: number;
  tags: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: SubjectType;
  mastered: boolean;
  tags: string[];
}

export interface StudySession {
  id: string;
  subject: SubjectType;
  durationMinutes: number;
  timestamp: number; // Date.now()
  type: 'focus' | 'short_break' | 'long_break';
}

export enum ViewState {
  HOME = 'HOME',
  PROGRESS = 'PROGRESS',
  SYLLABUS = 'SYLLABUS',
  PROBLEM_SOLVER = 'PROBLEM_SOLVER',
  QUIZ = 'QUIZ',
  NOTEBOOK = 'NOTEBOOK',
  AI_CHAT = 'AI_CHAT',
  CONCEPT_MAP = 'CONCEPT_MAP',
  LAB = 'LAB',
  FLASHCARDS = 'FLASHCARDS',
  SETTINGS = 'SETTINGS',
  PROJECT_LAB = 'PROJECT_LAB',
  POMODORO = 'POMODORO',
  RELAXATION = 'RELAXATION'
}
