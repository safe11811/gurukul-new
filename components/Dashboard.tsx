import React, { useEffect } from 'react';
import { SubjectType, ViewState } from '../types';
import { SUBJECTS } from '../constants';
import { storageService } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';
import { AIDailyGoals } from './Dashboard/AIDailyGoals';
import { FocusAudioPlayer } from './Audio/FocusAudioPlayer';
import { Layers, BrainCircuit, Zap, PenTool, Trophy, ChevronRight, BookOpen, Feather, Flame, Timer, BarChart2, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface DashboardProps {
  onChangeView: (view: ViewState) => void;
  onChangeSubject: (subject: SubjectType) => void;
  currentSubject: SubjectType;
}

export const Dashboard: React.FC<DashboardProps> = ({ onChangeView, onChangeSubject, currentSubject }) => {
  const { user } = useAuth();
  const mastery = storageService.getMastery(currentSubject);
  const subjectConfig = SUBJECTS.find(s => s.id === currentSubject);
  
  // Strict Filtering: If user has subjects, use them. 
  // If not (rare edge case), fallback to Science subjects only to avoid Accountancy showing up for everyone.
  const scienceDefaults = [SubjectType.PHYSICS, SubjectType.CHEMISTRY, SubjectType.MATH, SubjectType.BIOLOGY, SubjectType.ENGLISH, SubjectType.CS];
  
  const visibleSubjects = user?.subjects && user.subjects.length > 0 
    ? SUBJECTS.filter(s => user.subjects.includes(s.id))
    : SUBJECTS.filter(s => scienceDefaults.includes(s.id));

  useEffect(() => {
    if (mastery >= 90) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [mastery]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      
      {/* Hero Section */}
      <div className={`relative p-6 md:p-8 rounded-2xl overflow-hidden border ${subjectConfig?.border || 'border-border/10'} bg-surface shadow-lg`}>
         <div className={`absolute top-0 right-0 p-10 opacity-10 ${subjectConfig?.color} pointer-events-none`}>
            {subjectConfig && <subjectConfig.icon className="w-48 h-48 md:w-64 md:h-64 transform rotate-12" />}
         </div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surfaceHighlight border border-border/10 uppercase tracking-widest text-text-secondary">
                   {user?.classLevel || 'Guest'}
                 </span>
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 border border-purple-500/20 uppercase tracking-widest text-purple-600 dark:text-purple-300">
                   {user?.stream || 'Science'}
                 </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">{currentSubject} Overview</h1>
              <p className="text-text-secondary max-w-md text-sm md:text-base">{subjectConfig?.description}</p>
            </div>
            
            {/* Streak Counter */}
            {user?.streak && (
              <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl shadow-inner min-w-[120px]">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                  <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500 leading-none">{user.streak.count}</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-orange-500/80">Day Streak</div>
                </div>
              </div>
            )}
         </div>
         
         <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mt-8">
               <div className="flex-1 bg-surfaceHighlight h-3 rounded-full overflow-hidden w-full max-w-sm">
                  <div className="h-full bg-text-primary transition-all duration-1000 shadow-glow" style={{ width: `${mastery}%` }} />
               </div>
               <span className="text-lg md:text-xl font-bold text-text-primary font-mono flex items-center gap-2">
                 {mastery}% Mastered {mastery > 80 && <Trophy className="w-5 h-5 text-yellow-400" />}
               </span>
            </div>
         </div>
      </div>

      {/* AI Daily Goals Section */}
      <AIDailyGoals />

      {/* Focus Ambient Audio Player */}
      <FocusAudioPlayer onOpenRelaxationMode={() => onChangeView(ViewState.RELAXATION)} />

      {/* View Activity & Milestones Banner */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={() => onChangeView(ViewState.PROGRESS)}
        className="bg-surface border border-amber-500/20 rounded-2xl p-6 shadow-sm cursor-pointer hover:border-amber-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              Weekly Study Activity & Milestone Badges
            </h3>
            <p className="text-sm text-text-muted">Track your study time charts across subjects, view daily streaks, and unlock achievement badges.</p>
          </div>
        </div>
        <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold rounded-xl shadow-md transition-colors shrink-0 flex items-center gap-2">
          View Badges & Activity <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Focus Timer Banner */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={() => onChangeView(ViewState.POMODORO)}
        className="bg-surface border border-purple-500/20 rounded-2xl p-6 shadow-sm cursor-pointer hover:border-purple-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
            <Timer className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
              Focus Study Sprint ({currentSubject})
            </h3>
            <p className="text-sm text-text-muted">Start a 25-minute Pomodoro study interval to maximize retention and track focus time.</p>
          </div>
        </div>
        <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors shrink-0 flex items-center gap-2">
          Start Timer <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Subject Selection Grid - Filtered */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-4 px-1 flex justify-between items-center">
            <span>Your Subjects</span>
            <button onClick={() => onChangeView(ViewState.SETTINGS)} className="text-xs font-bold text-blue-500 hover:text-blue-400">Manage Subjects</button>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {visibleSubjects.map((sub) => (
             <button
               key={sub.id}
               onClick={() => onChangeSubject(sub.id)}
               className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all min-h-[105px]
                 ${currentSubject === sub.id ? `bg-surfaceHighlight ${sub.color} border-border/20 shadow-md ring-2 ring-blue-500/30` : 'bg-surface border-border/10 text-text-muted hover:bg-surfaceHighlight hover:text-text-primary hover:border-border/30'}`}
             >
                <sub.icon className="w-6 h-6" />
                <span className="text-xs font-bold text-center leading-tight">{sub.id}</span>
             </button>
          ))}
          <button 
             onClick={() => onChangeView(ViewState.SETTINGS)}
             className="p-4 rounded-2xl border border-dashed border-border/20 flex flex-col items-center justify-center gap-2 text-text-muted hover:text-text-primary hover:border-border/40 transition-colors bg-surface min-h-[105px]"
          >
             <span className="text-2xl font-thin">+</span>
             <span className="text-xs font-bold">Add Subject</span>
          </button>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
             onClick={() => onChangeView(ViewState.SYLLABUS)}
             className="p-6 bg-surface border border-border/10 rounded-2xl hover:border-border/30 transition text-left group shadow-sm hover:shadow-md"
          >
             <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-blue-500" />
             </div>
             <h3 className="text-xl font-bold text-text-primary mb-1">Logic & Syllabus</h3>
             <p className="text-sm text-text-muted">Access structured NCERT chapters for {user?.classLevel}.</p>
             <div className="mt-4 flex items-center text-blue-500 text-sm font-bold">
                View Curriculum <ChevronRight className="w-4 h-4 ml-1" />
             </div>
          </button>

          <button 
             onClick={() => onChangeView(ViewState.QUIZ)}
             className="p-6 bg-surface border border-border/10 rounded-2xl hover:border-border/30 transition text-left group shadow-sm hover:shadow-md"
          >
             <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-amber-500" />
             </div>
             <h3 className="text-xl font-bold text-text-primary mb-1">Exam Mode</h3>
             <p className="text-sm text-text-muted">Take full mock exams or chapter-wise tests.</p>
             <div className="mt-4 flex items-center text-amber-500 text-sm font-bold">
                Start Quiz <ChevronRight className="w-4 h-4 ml-1" />
             </div>
          </button>
      </div>

      <h2 className="text-lg font-bold text-text-primary mb-4 px-1">Quick Tools</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <QuickAction icon={BrainCircuit} label="Problem Solver" color="bg-purple-500/10 text-purple-500 border-purple-500/20" onClick={() => onChangeView(ViewState.PROBLEM_SOLVER)} />
          <QuickAction icon={Feather} label="Project Lab" color="bg-pink-500/10 text-pink-500 border-pink-500/20" onClick={() => onChangeView(ViewState.PROJECT_LAB)} />
          <QuickAction icon={Layers} label="Flashcards" color="bg-emerald-500/10 text-emerald-500 border-emerald-500/20" onClick={() => onChangeView(ViewState.FLASHCARDS)} />
          <QuickAction icon={PenTool} label="Notebook" color="bg-blue-500/10 text-blue-500 border-blue-500/20" onClick={() => onChangeView(ViewState.NOTEBOOK)} />
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border border-border/10 gap-3 transition-all active:scale-95 hover:border-border/30 ${color} shadow-sm bg-surface`}
  >
    <Icon className="w-6 h-6 md:w-8 md:h-8" />
    <span className="text-xs md:text-sm font-bold text-center leading-tight">{label}</span>
  </button>
);
