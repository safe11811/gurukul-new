import React, { useState, useEffect, useRef } from 'react';
import { SubjectType, StudySession } from '../types';
import { storageService } from '../services/storageService';
import { Play, Pause, RotateCcw, SkipForward, Clock, Flame, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  currentSubject: SubjectType;
}

type Mode = 'focus' | 'short_break' | 'long_break';

const MODE_PRESETS: Record<Mode, { label: string; defaultMinutes: number; color: string; bg: string }> = {
  focus: { label: 'Focus Session', defaultMinutes: 25, color: 'text-purple-500', bg: 'bg-purple-500' },
  short_break: { label: 'Short Break', defaultMinutes: 5, color: 'text-emerald-500', bg: 'bg-emerald-500' },
  long_break: { label: 'Long Break', defaultMinutes: 15, color: 'text-blue-500', bg: 'bg-blue-500' },
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ currentSubject }) => {
  const [mode, setMode] = useState<Mode>('focus');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);
  const [totalSubjectFocusMinutes, setTotalSubjectFocusMinutes] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load focus stats on mount or subject change
  useEffect(() => {
    const totalMins = storageService.getTotalFocusTimeMinutes(currentSubject);
    setTotalSubjectFocusMinutes(totalMins);
    
    const today = new Date().toDateString();
    const todaySessions = storageService.getStudySessions().filter(
      s => s.type === 'focus' && new Date(s.timestamp).toDateString() === today
    );
    setCompletedSessionsCount(todaySessions.length);
  }, [currentSubject]);

  // Handle mode change
  const handleModeChange = (newMode: Mode) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);
    const preset = MODE_PRESETS[newMode].defaultMinutes;
    setSelectedMinutes(preset);
    setTimeLeft(preset * 60);
  };

  // Timer Tick Effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedMinutes, currentSubject]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Audio chime alert using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio chime error:', e);
    }

    if (mode === 'focus') {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

      const newSession: StudySession = {
        id: Date.now().toString(),
        subject: currentSubject,
        durationMinutes: selectedMinutes,
        timestamp: Date.now(),
        type: 'focus'
      };
      storageService.saveStudySession(newSession);

      setTotalSubjectFocusMinutes(prev => prev + selectedMinutes);
      setCompletedSessionsCount(prev => prev + 1);
    }
  };

  const toggleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(selectedMinutes * 60);
  };

  const setCustomMinutes = (mins: number) => {
    if (mins < 1) return;
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
  };

  const totalSeconds = selectedMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Pomodoro Timer
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-surfaceHighlight text-text-secondary border border-border/10">
                {currentSubject}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Focused Study Session</h1>
            <p className="text-text-muted text-sm mt-1">Boost retention with structured focus sprints & active recovery breaks.</p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 bg-surfaceHighlight/50 border border-border/10 rounded-2xl p-4">
            <div className="text-center px-3 border-r border-border/10">
              <div className="text-xl font-bold text-text-primary">{completedSessionsCount}</div>
              <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Today's Sessions</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xl font-bold text-purple-500">{totalSubjectFocusMinutes} min</div>
              <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{currentSubject} Total</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Timer Display */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface border border-border/10 rounded-3xl p-8 shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Mode Selectors */}
        <div className="flex bg-surfaceHighlight p-1.5 rounded-2xl border border-border/10 gap-1 mb-8 w-full max-w-md">
          {(Object.keys(MODE_PRESETS) as Mode[]).map((m) => {
            const isCurrent = mode === m;
            return (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isCurrent 
                    ? 'bg-surface text-text-primary shadow-sm border border-border/10 scale-102' 
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {MODE_PRESETS[m].label}
              </button>
            );
          })}
        </div>

        {/* Circular Timer Visual */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center my-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-surfaceHighlight stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              className={`${MODE_PRESETS[mode].color} stroke-current`}
              strokeWidth="6"
              strokeDasharray="276.46" // 2 * pi * 44
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              initial={false}
              animate={{ strokeDashoffset: 276.46 - (276.46 * progressPercent) / 100 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </svg>

          {/* Time & Control Text inside Circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl md:text-6xl font-extrabold font-mono text-text-primary tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs font-semibold text-text-muted mt-2 uppercase tracking-widest flex items-center gap-1">
              {isRunning && <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block mr-1" />}
              {MODE_PRESETS[mode].label}
            </span>
          </div>
        </div>

        {/* Custom Duration Quick Presets */}
        <div className="flex items-center gap-2 mt-4 mb-8">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => setCustomMinutes(mins)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                selectedMinutes === mins
                  ? 'bg-purple-500/10 text-purple-600 border-purple-500/30'
                  : 'bg-surfaceHighlight text-text-muted border-border/10 hover:text-text-primary'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleStartPause}
            className={`px-8 py-4 rounded-2xl font-bold text-white flex items-center gap-3 shadow-lg transition-all ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" /> Pause Session
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Start Focus
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="p-4 bg-surfaceHighlight text-text-secondary hover:text-text-primary rounded-2xl border border-border/10 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
