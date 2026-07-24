import React from 'react';
import { Home, BrainCircuit, GraduationCap, BookOpen, Feather, Layers, Sparkles, Trophy } from 'lucide-react';
import { ViewState } from '../../types';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: ViewState.HOME, icon: Home, label: 'Home' },
    { id: ViewState.PROGRESS, icon: Trophy, label: 'Badges' },
    { id: ViewState.RELAXATION, icon: Sparkles, label: 'Relax' },
    { id: ViewState.SYLLABUS, icon: BookOpen, label: 'Logic' },
    { id: ViewState.PROBLEM_SOLVER, icon: BrainCircuit, label: 'Solver' }, 
    { id: ViewState.PROJECT_LAB, icon: Feather, label: 'Projects' },
    { id: ViewState.QUIZ, icon: GraduationCap, label: 'Exams' },
    { id: ViewState.FLASHCARDS, icon: Layers, label: 'Cards' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 md:hidden bg-surface/95 backdrop-blur-xl border-t border-border/10 z-50">
      <div className="flex items-center h-full overflow-x-auto scrollbar-hide px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`
                relative flex flex-col items-center justify-center min-w-[64px] flex-1 h-full gap-1.5 active:scale-95 transition-transform
                ${isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}
              `}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 bg-purple-500 shadow-[0_0_10px_#a855f7]" />
              )}

              <Icon 
                className={`
                  w-5 h-5 transition-all duration-300
                  ${isActive ? 'scale-110 text-purple-600 dark:text-purple-400' : ''}
                `} 
              />
              
              <span className={`text-[9px] font-bold tracking-wide uppercase transition-colors ${isActive ? 'text-text-primary' : 'text-text-muted'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
