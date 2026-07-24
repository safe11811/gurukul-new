import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Shield, Moon, Sun, Book, LogOut, Layers, Check, Palette } from 'lucide-react';
import { ClassLevel, StreamType, SubjectType } from '../../types';
import { SUBJECTS } from '../../constants';
import { storageService } from '../../services/storageService';

export const SettingsView: React.FC = () => {
  const { user, login, logout, updateClassLevel, toggleTheme, setTheme } = useAuth();
  
  // Local state for immediate UI feedback before saving to context/storage
  const [selectedStream, setSelectedStream] = useState<StreamType>(user?.stream || 'Science');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectType[]>(user?.subjects || []);

  const levels: ClassLevel[] = ['Grade 11', 'Grade 12'];
  const streams: StreamType[] = ['Science', 'Commerce', 'Humanities', 'Custom'];

  // Default subject presets
  const STREAM_PRESETS: Record<string, SubjectType[]> = {
    'Science': [SubjectType.PHYSICS, SubjectType.CHEMISTRY, SubjectType.MATH, SubjectType.BIOLOGY, SubjectType.ENGLISH, SubjectType.CS],
    'Commerce': [SubjectType.ACCOUNTANCY, SubjectType.BUSINESS_STUDIES, SubjectType.ECONOMICS, SubjectType.ENTREPRENEURSHIP, SubjectType.MATH, SubjectType.ENGLISH],
    'Humanities': [SubjectType.HISTORY, SubjectType.POLITICAL_SCIENCE, SubjectType.PSYCHOLOGY, SubjectType.LEGAL_STUDIES, SubjectType.ENGLISH, SubjectType.COMMERCIAL_ARTS]
  };

  useEffect(() => {
    if (user) {
      setSelectedStream(user.stream || 'Science');
      setSelectedSubjects(user.subjects || STREAM_PRESETS['Science']);
    }
  }, [user]);

  const handleStreamChange = (stream: StreamType) => {
    setSelectedStream(stream);
    if (stream !== 'Custom') {
      const preset = STREAM_PRESETS[stream];
      setSelectedSubjects(preset);
      savePreferences(stream, preset);
    } else {
        // Keep current subjects but mark as custom
        savePreferences(stream, selectedSubjects);
    }
  };

  const toggleSubject = (subject: SubjectType) => {
    let newSubjects;
    if (selectedSubjects.includes(subject)) {
      newSubjects = selectedSubjects.filter(s => s !== subject);
    } else {
      newSubjects = [...selectedSubjects, subject];
    }
    
    setSelectedSubjects(newSubjects);
    setSelectedStream('Custom');
    savePreferences('Custom', newSubjects);
  };

  const savePreferences = (stream: StreamType, subjects: SubjectType[]) => {
    if (user) {
      const updatedProfile = { ...user, stream, subjects };
      storageService.saveUserProfile(updatedProfile);
      // Hack to update user object in place for immediate feedback without full context reload
      user.stream = stream;
      user.subjects = subjects;
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Account Required</h2>
        <p className="text-text-muted mb-8 max-w-md">
          Please sign in to manage your settings, streams, and syllabus preferences.
        </p>
        <button 
           onClick={() => login()}
           className="px-6 py-3 bg-text-primary text-background font-bold rounded-xl hover:opacity-90 transition flex items-center gap-2"
        >
           <User className="w-5 h-5" /> Sign In / Create Account
        </button>
      </div>
    );
  }

  const isDark = user.preferences.theme === 'dark';

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-surface border border-border/10 rounded-xl p-6">
           <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
             <User className="w-5 h-5 text-blue-500" /> Profile
           </h2>
           <div className="flex items-center gap-4 mb-6">
              <img src={user.photoURL} className="w-16 h-16 rounded-full border-2 border-border/10" alt="Profile" />
              <div>
                 <p className="font-bold text-xl text-text-primary">{user.name}</p>
                 <p className="text-sm text-text-muted">{user.email}</p>
              </div>
           </div>
           
           <button onClick={logout} className="w-full py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </section>

        {/* App Preferences */}
        <section className="bg-surface border border-border/10 rounded-xl p-6">
           <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
             <Palette className="w-5 h-5 text-purple-500" />
             App Appearance & Theme
           </h2>
           <div className="grid grid-cols-3 gap-3">
             <button
               onClick={() => setTheme('dark')}
               className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-2 ${
                 user?.preferences?.theme === 'dark' || (!user?.preferences?.theme)
                   ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                   : 'bg-surfaceHighlight text-text-muted border-border/10 hover:border-border/30'
               }`}
             >
               <Moon className="w-4 h-4" />
               <span>Dark</span>
             </button>

             <button
               onClick={() => setTheme('light')}
               className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-2 ${
                 user?.preferences?.theme === 'light'
                   ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                   : 'bg-surfaceHighlight text-text-muted border-border/10 hover:border-border/30'
               }`}
             >
               <Sun className="w-4 h-4" />
               <span>Light</span>
             </button>

             <button
               onClick={() => setTheme('neo-brutalism')}
               className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                 user?.preferences?.theme === 'neo-brutalism'
                   ? 'bg-amber-400 text-black border-2 border-black font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                   : 'bg-surfaceHighlight text-text-muted border border-border/10 hover:border-border/30'
               }`}
             >
               <Palette className="w-4 h-4" />
               <span>Neo Brutalism</span>
             </button>
           </div>
        </section>

        {/* Academic Preferences */}
        <section className="bg-surface border border-border/10 rounded-xl p-6">
           <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
             <Book className="w-5 h-5 text-yellow-500" /> Academic Stream
           </h2>
           
           <div className="space-y-6">
              <div>
                 <label className="block text-xs font-bold text-text-secondary uppercase mb-3">Your Stream</label>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {streams.map(s => (
                      <button
                        key={s}
                        onClick={() => handleStreamChange(s)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all truncate
                          ${selectedStream === s 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-surfaceHighlight text-text-muted border-border/10 hover:border-border/30'}`}
                      >
                        {s}
                      </button>
                    ))}
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-text-secondary uppercase mb-3">Active Subjects</label>
                 <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                    {SUBJECTS.map(sub => (
                       <button 
                         key={sub.id}
                         onClick={() => toggleSubject(sub.id)}
                         className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all
                            ${selectedSubjects.includes(sub.id) 
                               ? 'bg-surfaceHighlight border-border/30 text-text-primary' 
                               : 'bg-transparent border-transparent text-text-muted hover:bg-surfaceHighlight'}`}
                       >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSubjects.includes(sub.id) ? 'bg-green-500 border-green-500' : 'border-border/20'}`}>
                             {selectedSubjects.includes(sub.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-xs font-medium truncate">{sub.id}</span>
                       </button>
                    ))}
                 </div>
              </div>

              <div className="border-t border-border/10 pt-4">
                 <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Class Level</label>
                 <div className="grid grid-cols-2 gap-3">
                    {levels.map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => updateClassLevel(lvl)}
                        className={`py-3 rounded-lg text-sm font-bold border transition-all
                          ${user.classLevel === lvl 
                            ? 'bg-text-primary text-background border-text-primary' 
                            : 'bg-surfaceHighlight text-text-muted border-border/10 hover:border-border/30'}`}
                      >
                        {lvl}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};
