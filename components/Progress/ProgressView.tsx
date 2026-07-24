import React from 'react';
import { SubjectType, ViewState } from '../../types';
import { WeeklyStudyChart } from '../Dashboard/WeeklyStudyChart';
import { Achievements } from '../Dashboard/Achievements';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { Trophy, Clock, Flame, Award, Sparkles, TrendingUp, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressViewProps {
  currentSubject: SubjectType;
  onChangeView: (view: ViewState) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ currentSubject, onChangeView }) => {
  const { user } = useAuth();
  const userSubjects = user?.subjects || [SubjectType.PHYSICS, SubjectType.CHEMISTRY, SubjectType.MATH];

  const totalFocusMins = storageService.getTotalFocusTimeMinutes();
  const streakCount = user?.streak?.count || 1;
  const studySessions = storageService.getStudySessions();
  const quizResults = storageService.getQuizResults();

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-border/10 p-6 md:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Trophy className="w-3.5 h-3.5" /> Study Analytics & Milestones
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
              Track Your Study Journey & Unlock Badges
            </h1>
            <p className="text-sm text-text-muted leading-relaxed">
              Monitor your weekly study distribution across subjects, view detailed focus trends, and celebrate milestone achievements as you build consistent study habits.
            </p>
          </div>

          <button
            onClick={() => onChangeView(ViewState.POMODORO)}
            className="shrink-0 px-5 py-3 rounded-2xl bg-text-primary text-background hover:bg-text-primary/90 transition-all font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
          >
            <Clock className="w-4 h-4 text-amber-400" /> Start Focus Session
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface border border-border/10 rounded-2xl p-4 shadow-sm flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Total Focus Time</p>
            <p className="text-lg font-extrabold text-text-primary font-mono">{totalFocusMins} mins</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface border border-border/10 rounded-2xl p-4 shadow-sm flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Active Streak</p>
            <p className="text-lg font-extrabold text-text-primary font-mono">{streakCount} Days</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface border border-border/10 rounded-2xl p-4 shadow-sm flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Study Sessions</p>
            <p className="text-lg font-extrabold text-text-primary font-mono">{studySessions.length}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface border border-border/10 rounded-2xl p-4 shadow-sm flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Quizzes Taken</p>
            <p className="text-lg font-extrabold text-text-primary font-mono">{quizResults.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Recharts Weekly Study Activity Component */}
      <WeeklyStudyChart
        userSubjects={userSubjects}
        currentSubject={currentSubject}
        onStartFocusSprint={() => onChangeView(ViewState.POMODORO)}
      />

      {/* Achievements and Badges Component */}
      <Achievements />
    </div>
  );
};
