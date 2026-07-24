import React, { useState } from 'react';
import { Trophy, Award, Flame, Zap, Clock, Star, BookOpen, CheckCircle2, Lock, Sparkles, Target, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { SubjectType } from '../../types';

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'time' | 'quiz' | 'mastery';
  icon: any;
  color: string; // Tailwind color classes
  bgGradient: string;
  currentProgress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export const Achievements: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const streakCount = user?.streak?.count || 1;
  const totalFocusMins = storageService.getTotalFocusTimeMinutes();
  const studySessions = storageService.getStudySessions();
  const quizResults = storageService.getQuizResults();
  const masteredChapters = storageService.getMasteredChapters();

  // Calculate highest subject mastery
  const subjects = user?.subjects || [SubjectType.PHYSICS, SubjectType.CHEMISTRY, SubjectType.MATH];
  const maxMastery = Math.max(0, ...subjects.map(s => storageService.getMastery(s)));

  // Count high scoring quizzes (score >= 80%)
  const highScoringQuizzes = quizResults.filter(q => (q.score / q.totalQuestions) >= 0.8).length;

  const badges: Badge[] = [
    {
      id: 'scholar-starter',
      title: 'Scholar Starter',
      description: 'Complete your first focus session or quiz',
      category: 'time',
      icon: Zap,
      color: 'text-amber-500',
      bgGradient: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
      currentProgress: Math.min(1, studySessions.length + quizResults.length),
      maxProgress: 1,
      unlocked: (studySessions.length + quizResults.length) >= 1
    },
    {
      id: 'streak-3',
      title: 'Consistency Cadet',
      description: 'Maintain a 3-day active study streak',
      category: 'streak',
      icon: Flame,
      color: 'text-orange-500',
      bgGradient: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
      currentProgress: Math.min(3, streakCount),
      maxProgress: 3,
      unlocked: streakCount >= 3
    },
    {
      id: 'streak-7',
      title: 'Unstoppable Legend',
      description: 'Achieve a full 7-day study streak',
      category: 'streak',
      icon: Trophy,
      color: 'text-yellow-500',
      bgGradient: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
      currentProgress: Math.min(7, streakCount),
      maxProgress: 7,
      unlocked: streakCount >= 7
    },
    {
      id: 'focus-60',
      title: 'Deep Focus Master',
      description: 'Log 60+ total minutes of focused study',
      category: 'time',
      icon: Clock,
      color: 'text-blue-500',
      bgGradient: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      currentProgress: Math.min(60, totalFocusMins),
      maxProgress: 60,
      unlocked: totalFocusMins >= 60
    },
    {
      id: 'focus-300',
      title: 'Study Titan',
      description: 'Accumulate 300+ minutes (5 hours) of study time',
      category: 'time',
      icon: Award,
      color: 'text-purple-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      currentProgress: Math.min(300, totalFocusMins),
      maxProgress: 300,
      unlocked: totalFocusMins >= 300
    },
    {
      id: 'quiz-ace',
      title: 'NCERT Quiz Ace',
      description: 'Score 80%+ on 3 different NCERT practice quizzes',
      category: 'quiz',
      icon: Star,
      color: 'text-emerald-500',
      bgGradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
      currentProgress: Math.min(3, highScoringQuizzes),
      maxProgress: 3,
      unlocked: highScoringQuizzes >= 3
    },
    {
      id: 'mastery-80',
      title: 'Subject Domain Expert',
      description: 'Reach 80%+ mastery score in any subject',
      category: 'mastery',
      icon: ShieldCheck,
      color: 'text-cyan-500',
      bgGradient: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
      currentProgress: Math.min(80, maxMastery),
      maxProgress: 80,
      unlocked: maxMastery >= 80
    },
    {
      id: 'chapter-pioneer',
      title: 'Chapter Pioneer',
      description: 'Master at least 3 chapters in your syllabus',
      category: 'mastery',
      icon: BookOpen,
      color: 'text-rose-500',
      bgGradient: 'from-rose-500/20 to-red-500/20 border-rose-500/30',
      currentProgress: Math.min(3, masteredChapters.length),
      maxProgress: 3,
      unlocked: masteredChapters.length >= 3
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const filteredBadges = badges.filter(b => {
    if (filter === 'unlocked') return b.unlocked;
    if (filter === 'locked') return !b.unlocked;
    return true;
  });

  return (
    <div className="bg-surface border border-border/10 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Milestones & Achievements
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {unlockedCount}/{badges.length} Unlocked
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Earn badges as you extend study streaks, complete quizzes, and master chapters!
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-surfaceHighlight p-1 rounded-xl border border-border/10 shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-surface text-text-primary shadow-sm border border-border/10' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            All ({badges.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'unlocked' ? 'bg-surface text-text-primary shadow-sm border border-border/10' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'locked' ? 'bg-surface text-text-primary shadow-sm border border-border/10' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Locked ({badges.length - unlockedCount})
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs text-text-muted">
          <span className="font-semibold">Overall Badge Unlocks</span>
          <span className="font-mono font-bold text-text-primary">
            {Math.round((unlockedCount / badges.length) * 100)}% Completed
          </span>
        </div>
        <div className="w-full bg-surfaceHighlight h-2.5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        <AnimatePresence mode="popLayout">
          {filteredBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all ${
                  badge.unlocked
                    ? `bg-gradient-to-br ${badge.bgGradient} shadow-sm border-border/20`
                    : 'bg-surfaceHighlight/30 border-border/10 opacity-70 grayscale-[0.6]'
                }`}
              >
                {/* Top Badge Icon & Status */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      badge.unlocked
                        ? 'bg-surface shadow-md'
                        : 'bg-surfaceHighlight/80 text-text-muted'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${badge.unlocked ? badge.color : 'text-text-muted'}`} />
                  </div>

                  {badge.unlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-text-muted bg-surfaceHighlight px-2 py-0.5 rounded-full border border-border/10">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                {/* Badge Info */}
                <div>
                  <h3 className="text-sm font-bold text-text-primary leading-tight">
                    {badge.title}
                  </h3>
                  <p className="text-[11px] text-text-muted mt-1 leading-snug line-clamp-2">
                    {badge.description}
                  </p>
                </div>

                {/* Individual Badge Progress Bar */}
                <div className="space-y-1 pt-1 border-t border-border/10">
                  <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
                    <span>Progress</span>
                    <span className="font-bold">
                      {badge.currentProgress} / {badge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-surfaceHighlight h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        badge.unlocked ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${(badge.currentProgress / badge.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
