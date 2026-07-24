import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie } from 'recharts';
import { SubjectType, StudySession } from '../../types';
import { storageService } from '../../services/storageService';
import { SUBJECTS } from '../../constants';
import { BarChart3, PieChart as PieChartIcon, Clock, Plus, Trophy, Sparkles, Calendar, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeeklyStudyChartProps {
  userSubjects: SubjectType[];
  currentSubject: SubjectType;
  onStartFocusSprint?: () => void;
}

// Subject color palette helper
const SUBJECT_COLORS: Record<string, string> = {
  [SubjectType.PHYSICS]: '#3b82f6', // blue
  [SubjectType.CHEMISTRY]: '#a855f7', // purple
  [SubjectType.MATH]: '#eab308', // yellow/amber
  [SubjectType.BIOLOGY]: '#22c55e', // green
  [SubjectType.CS]: '#06b6d4', // cyan
  [SubjectType.ENGLISH]: '#ec4899', // pink
  [SubjectType.ACCOUNTANCY]: '#f97316', // orange
  [SubjectType.BUSINESS_STUDIES]: '#6366f1', // indigo
  [SubjectType.ECONOMICS]: '#14b8a6', // teal
  [SubjectType.POLITICAL_SCIENCE]: '#ef4444', // red
  [SubjectType.HISTORY]: '#8b5cf6', // violet
  [SubjectType.PSYCHOLOGY]: '#f43f5e', // rose
};

const DEFAULT_COLOR = '#64748b';

// Helper to seed initial realistic weekly sessions if user is brand new
const ensureWeeklySessions = (subjects: SubjectType[]) => {
  const existing = storageService.getStudySessions();
  if (existing.length > 0) return existing;

  const sampleSubjects = subjects.length > 0 ? subjects : [SubjectType.PHYSICS, SubjectType.CHEMISTRY, SubjectType.MATH, SubjectType.ENGLISH];
  const now = new Date();
  const sampleSessions: StudySession[] = [];

  // Seed sample data for past 7 days
  const sampleDataMap = [
    { dayOffset: 6, subIdx: 0, mins: 45 },
    { dayOffset: 6, subIdx: 1, mins: 30 },
    { dayOffset: 5, subIdx: 2, mins: 60 },
    { dayOffset: 4, subIdx: 0, mins: 25 },
    { dayOffset: 4, subIdx: 3, mins: 40 },
    { dayOffset: 3, subIdx: 1, mins: 50 },
    { dayOffset: 2, subIdx: 2, mins: 35 },
    { dayOffset: 2, subIdx: 0, mins: 30 },
    { dayOffset: 1, subIdx: 1, mins: 45 },
    { dayOffset: 0, subIdx: 0, mins: 25 },
  ];

  sampleDataMap.forEach((item, idx) => {
    const sessionDate = new Date(now);
    sessionDate.setDate(now.getDate() - item.dayOffset);
    const sub = sampleSubjects[item.subIdx % sampleSubjects.length];

    sampleSessions.push({
      id: `sample-session-${idx}`,
      subject: sub,
      durationMinutes: item.mins,
      timestamp: sessionDate.getTime(),
      type: 'focus'
    });
  });

  sampleSessions.forEach(s => storageService.saveStudySession(s));
  return sampleSessions;
};

export const WeeklyStudyChart: React.FC<WeeklyStudyChartProps> = ({ userSubjects, currentSubject, onStartFocusSprint }) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [chartView, setChartView] = useState<'bar' | 'pie'>('bar');
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [logSubject, setLogSubject] = useState<SubjectType>(currentSubject || SubjectType.PHYSICS);
  const [logMinutes, setLogMinutes] = useState<number>(30);
  const [logDaysAgo, setLogDaysAgo] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loaded = ensureWeeklySessions(userSubjects);
    setSessions(loaded);
  }, [userSubjects]);

  const refreshSessions = () => {
    setSessions(storageService.getStudySessions());
  };

  // Generate last 7 days buckets
  const daysData = React.useMemo(() => {
    const result = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toDateString();
      const dayLabel = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Find all focus sessions on this date
      const daySessions = sessions.filter(
        s => s.type === 'focus' && new Date(s.timestamp).toDateString() === dateStr
      );

      const totalMins = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);

      // Subject breakdown for this day
      const subjectBreakdown: Record<string, number> = {};
      daySessions.forEach(s => {
        subjectBreakdown[s.subject] = (subjectBreakdown[s.subject] || 0) + s.durationMinutes;
      });

      // Primary subject for coloring
      let topSubject = 'General';
      let maxSubMins = 0;
      Object.entries(subjectBreakdown).forEach(([sub, mins]) => {
        if (mins > maxSubMins) {
          maxSubMins = mins;
          topSubject = sub;
        }
      });

      result.push({
        dayLabel,
        fullDateLabel,
        dateStr,
        totalMins,
        topSubject,
        color: SUBJECT_COLORS[topSubject] || DEFAULT_COLOR,
        ...subjectBreakdown
      });
    }

    return result;
  }, [sessions]);

  // Aggregate by Subject for Pie/Bar Distribution
  const subjectDistributionData = React.useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = sessions.filter(s => s.type === 'focus' && s.timestamp >= sevenDaysAgo.getTime());
    const subjectMap: Record<string, number> = {};

    recentSessions.forEach(s => {
      subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.durationMinutes;
    });

    return Object.entries(subjectMap).map(([subject, mins]) => ({
      name: subject,
      value: mins,
      color: SUBJECT_COLORS[subject] || DEFAULT_COLOR
    })).sort((a, b) => b.value - a.value);
  }, [sessions]);

  // Calculated Stats
  const totalWeeklyMinutes = daysData.reduce((acc, d) => acc + d.totalMins, 0);
  const dailyAverageMinutes = Math.round(totalWeeklyMinutes / 7);
  const topSubjectThisWeek = subjectDistributionData[0]?.name || 'Physics';

  const handleManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (logMinutes <= 0) return;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - logDaysAgo);

    const newSession: StudySession = {
      id: `manual-${Date.now()}`,
      subject: logSubject,
      durationMinutes: Number(logMinutes),
      timestamp: targetDate.getTime(),
      type: 'focus'
    };

    storageService.saveStudySession(newSession);
    refreshSessions();
    setShowLogModal(false);
    setToastMessage(`Logged ${logMinutes} mins of ${logSubject}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border/20 rounded-xl p-3 shadow-xl text-xs space-y-1 z-50">
          <p className="font-bold text-text-primary border-b border-border/10 pb-1 flex justify-between gap-3">
            <span>{data.dayLabel} ({data.fullDateLabel})</span>
            <span className="text-purple-500 font-mono font-extrabold">{data.totalMins} mins</span>
          </p>
          {data.totalMins === 0 ? (
            <p className="text-text-muted italic py-1">No study sessions logged</p>
          ) : (
            <div className="pt-1 space-y-1">
              {Object.entries(data)
                .filter(([key]) => !['dayLabel', 'fullDateLabel', 'dateStr', 'totalMins', 'topSubject', 'color'].includes(key))
                .map(([sub, mins]: any) => (
                  <div key={sub} className="flex items-center justify-between gap-4 text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SUBJECT_COLORS[sub] || DEFAULT_COLOR }} />
                      {sub}
                    </span>
                    <span className="font-bold text-text-primary font-mono">{mins}m</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      );
    };
    return null;
  };

  return (
    <div className="bg-surface border border-border/10 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-500" /> Weekly Study Activity
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Recharts Analytics
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">Track daily focus minutes and time allocation across your subjects.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-surfaceHighlight p-1 rounded-xl border border-border/10">
            <button
              onClick={() => setChartView('bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                chartView === 'bar' ? 'bg-surface text-text-primary shadow-sm border border-border/10' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Daily
            </button>
            <button
              onClick={() => setChartView('pie')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                chartView === 'pie' ? 'bg-surface text-text-primary shadow-sm border border-border/10' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" /> Share
            </button>
          </div>

          {/* Log Session Button */}
          <button
            onClick={() => setShowLogModal(true)}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Session
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surfaceHighlight/50 border border-border/10 rounded-xl p-3">
          <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-500" /> Total Week
          </div>
          <div className="text-xl font-extrabold text-text-primary font-mono mt-1">
            {Math.floor(totalWeeklyMinutes / 60)}h {totalWeeklyMinutes % 60}m
          </div>
        </div>

        <div className="bg-surfaceHighlight/50 border border-border/10 rounded-xl p-3">
          <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-500" /> Daily Avg
          </div>
          <div className="text-xl font-extrabold text-text-primary font-mono mt-1">
            {dailyAverageMinutes}m<span className="text-xs text-text-muted font-normal">/day</span>
          </div>
        </div>

        <div className="bg-surfaceHighlight/50 border border-border/10 rounded-xl p-3">
          <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider flex items-center gap-1">
            <Trophy className="w-3 h-3 text-amber-500" /> Top Subject
          </div>
          <div className="text-sm font-bold text-text-primary truncate mt-1">
            {topSubjectThisWeek}
          </div>
        </div>

        <div className="bg-surfaceHighlight/50 border border-border/10 rounded-xl p-3">
          <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-green-500" /> Focus Streak
          </div>
          <div className="text-xl font-extrabold text-green-500 font-mono mt-1">
            {daysData.filter(d => d.totalMins > 0).length} <span className="text-xs text-text-muted font-normal">/ 7 days</span>
          </div>
        </div>
      </div>

      {/* Chart Visualizations Container */}
      <div className="h-64 w-full pt-2">
        {chartView === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="dayLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit="m"
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="totalMins" radius={[8, 8, 0, 0]} maxBarSize={45}>
                {daysData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.totalMins > 0 ? entry.color : '#e2e8f0'}
                    opacity={entry.totalMins > 0 ? 0.9 : 0.25}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 h-full">
            <div className="h-full w-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} mins`, name]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                  <Pie
                    data={subjectDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {subjectDistributionData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Distribution Legend */}
            <div className="grid grid-cols-2 gap-2 flex-1 max-w-md text-xs">
              {subjectDistributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-surfaceHighlight/40 border border-border/10">
                  <span className="flex items-center gap-2 text-text-secondary truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-bold font-mono text-text-primary ml-2">{item.value}m</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual Study Log Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border/20 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-border/10 pb-3">
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-500" /> Log Offline Study Time
                </h3>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="p-1 text-text-muted hover:text-text-primary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleManualLog} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Subject</label>
                  <select
                    value={logSubject}
                    onChange={(e) => setLogSubject(e.target.value as SubjectType)}
                    className="w-full bg-surfaceHighlight border border-border/10 rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500/50"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      min="5"
                      max="360"
                      value={logMinutes}
                      onChange={(e) => setLogMinutes(Number(e.target.value))}
                      className="w-full bg-surfaceHighlight border border-border/10 rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">When did you study?</label>
                    <select
                      value={logDaysAgo}
                      onChange={(e) => setLogDaysAgo(Number(e.target.value))}
                      className="w-full bg-surfaceHighlight border border-border/10 rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-purple-500/50"
                    >
                      <option value={0}>Today</option>
                      <option value={1}>Yesterday</option>
                      <option value={2}>2 days ago</option>
                      <option value={3}>3 days ago</option>
                      <option value={4}>4 days ago</option>
                      <option value={5}>5 days ago</option>
                      <option value={6}>6 days ago</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border/10 text-xs font-bold text-text-secondary hover:bg-surfaceHighlight transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Save Study Log
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
