import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/Layout/BottomNav';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProblemSolver } from './components/ProblemSolver';
import { QuizMode } from './components/Quiz/QuizMode';
import { NotebookView } from './components/Notebook/NotebookView';
import { FlashcardMode } from './components/Flashcards/FlashcardMode';
import { SettingsView } from './components/Settings/SettingsView';
import { SyllabusView } from './components/Syllabus/SyllabusView';
import { ProjectView } from './components/Project/ProjectView';
import { PomodoroTimer } from './components/PomodoroTimer';
import { RelaxationMode } from './components/Relaxation/RelaxationMode';
import { ProgressView } from './components/Progress/ProgressView';
import { SubjectType, ViewState } from './types';
import { SUBJECT_DETAILS } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const { user, updateStreak } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [currentSubject, setCurrentSubject] = useState<SubjectType>(SubjectType.PHYSICS);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // 1. Smart Subject Memory & Streak Update
  useEffect(() => {
    if (user) {
      if (user.lastSelectedSubject) {
        setCurrentSubject(user.lastSelectedSubject);
      }
      updateStreak();
    }
  }, [user]);

  // 2. Browser History API for Swipe Back
  useEffect(() => {
    // Initial state
    window.history.replaceState({ view: ViewState.HOME }, '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        setCurrentView(ViewState.HOME);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleViewChange = (view: ViewState) => {
    if (view === ViewState.RELAXATION) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
    setCurrentView(view);
    window.history.pushState({ view }, '', `#${view.toLowerCase()}`);
  };

  const handleSubjectChange = (subject: SubjectType) => {
    setCurrentSubject(subject);
    if (user) {
      storageService.updateUserSubject(subject);
    }
  };

  return (
    <div className={`min-h-screen bg-background text-text-primary pb-20 md:pb-0 md:pl-72 transition-colors duration-300 ${isShaking ? 'animate-page-shake' : ''}`}>
      
      {/* Desktop Sidebar & Mobile Drawer */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={handleViewChange}
        currentSubject={currentSubject}
        onChangeSubject={handleSubjectChange}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        currentView={currentView} 
        onChangeView={handleViewChange}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        
        {/* Dynamic Header */}
        <header className="mb-6 md:mb-8 flex justify-between items-center sticky top-0 z-30 py-4 bg-background/80 backdrop-blur-md transition-colors duration-300">
           {/* Adjusted padding: no longer need left padding on mobile since menu is on right */}
           <div className="pl-0">
             <div className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 opacity-70">
                {currentView !== ViewState.HOME ? currentSubject : 'Gurukul'}
             </div>
             <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                {currentView === ViewState.HOME && 'Subject Dashboard'}
                {currentView === ViewState.PROGRESS && 'Activity & Milestones'}
                {currentView === ViewState.POMODORO && 'Focus Timer'}
                {currentView === ViewState.RELAXATION && 'Relaxation Sanctuary'}
                {currentView === ViewState.SYLLABUS && 'Logic Section'}
                {currentView === ViewState.PROBLEM_SOLVER && 'Problem Solver'}
                {currentView === ViewState.PROJECT_LAB && 'Project Lab'}
                {currentView === ViewState.QUIZ && 'Exam Mode'}
                {currentView === ViewState.NOTEBOOK && 'My Notebook'}
                {currentView === ViewState.FLASHCARDS && 'Revision Cards'}
                {currentView === ViewState.SETTINGS && 'Settings'}
             </h1>
           </div>
        </header>

        <AnimatePresence mode="wait">
          {currentView === ViewState.RELAXATION ? (
            <RelaxationMode key="relaxation" onExit={() => handleViewChange(ViewState.HOME)} />
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {currentView === ViewState.HOME && (
                <Dashboard 
                  onChangeView={handleViewChange} 
                  onChangeSubject={handleSubjectChange}
                  currentSubject={currentSubject}
                />
              )}
              {currentView === ViewState.PROGRESS && (
                <ProgressView
                  currentSubject={currentSubject}
                  onChangeView={handleViewChange}
                />
              )}
              {currentView === ViewState.POMODORO && <PomodoroTimer currentSubject={currentSubject} />}
              {currentView === ViewState.SYLLABUS && <SyllabusView subject={currentSubject} onChangeView={handleViewChange} />}
              {currentView === ViewState.PROBLEM_SOLVER && <ProblemSolver subject={currentSubject} />}
              {currentView === ViewState.PROJECT_LAB && <ProjectView subject={currentSubject} />}
              {currentView === ViewState.QUIZ && <QuizMode subject={currentSubject} />}
              {currentView === ViewState.NOTEBOOK && <NotebookView subject={currentSubject} />}
              {currentView === ViewState.FLASHCARDS && <FlashcardMode subject={currentSubject} />}
              {currentView === ViewState.SETTINGS && <SettingsView />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
