import React from 'react';
import { SubjectType, ViewState } from '../../types';
import { SUBJECTS } from '../../constants';
import { LayoutDashboard, BrainCircuit, BookOpen, GraduationCap, Settings, Menu, PenTool, Layers, Feather, X, Timer, Sparkles, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  currentSubject: SubjectType;
  onChangeSubject: (subj: SubjectType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, currentSubject, onChangeSubject }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAuth();

  const handleViewChange = (view: ViewState) => {
    onChangeView(view);
    setIsOpen(false);
  };

  const handleSubjectChange = (id: SubjectType) => {
    onChangeSubject(id);
    setIsOpen(false);
  };

  const scienceDefaults = [SubjectType.PHYSICS, SubjectType.CHEMISTRY, SubjectType.MATH, SubjectType.BIOLOGY, SubjectType.ENGLISH, SubjectType.CS];
  const visibleSubjects = user?.subjects && user.subjects.length > 0 
    ? SUBJECTS.filter(s => user.subjects.includes(s.id))
    : SUBJECTS.filter(s => scienceDefaults.includes(s.id));

  return (
    <>
      {/* Mobile Top Right Controls */}
      <div className="md:hidden fixed top-4 right-4 z-50 flex gap-3">
        <button 
          onClick={() => onChangeView(ViewState.SETTINGS)}
          className="p-2.5 bg-surfaceHighlight/80 backdrop-blur rounded-lg shadow-lg border border-border/10 text-text-primary active:scale-95 transition-transform"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2.5 bg-surfaceHighlight/80 backdrop-blur rounded-lg shadow-lg border border-border/10 text-text-primary active:scale-95 transition-transform"
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`
        fixed top-0 bottom-0 w-72 bg-surface border-r border-border/10 
        transform transition-transform duration-300 z-50 flex flex-col shadow-2xl
        md:left-0 md:translate-x-0
        ${isOpen ? 'right-0 translate-x-0 border-l' : 'right-0 translate-x-full md:right-auto md:border-r'} 
      `}>
        <div className="p-6 border-b border-border/10 bg-surfaceHighlight/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center transform rotate-3 shadow-glow text-white">
              <span className="font-mono text-xl font-bold">G</span>
            </div>
            <div>
               <span className="font-sans text-xl font-bold text-text-primary tracking-tight">Gurukul</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-2 text-text-muted hover:text-text-primary bg-surfaceHighlight rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          
          <div className="space-y-1">
            <p className="px-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-2 font-mono opacity-70">Modes</p>
            <NavBtn icon={LayoutDashboard} label="Dashboard" active={currentView === ViewState.HOME} onClick={() => handleViewChange(ViewState.HOME)} />
            <NavBtn icon={Trophy} label="Activity & Badges" active={currentView === ViewState.PROGRESS} onClick={() => handleViewChange(ViewState.PROGRESS)} />
            <NavBtn icon={Timer} label="Focus Timer" active={currentView === ViewState.POMODORO} onClick={() => handleViewChange(ViewState.POMODORO)} />
            <NavBtn icon={Sparkles} label="Relaxation" active={currentView === ViewState.RELAXATION} onClick={() => handleViewChange(ViewState.RELAXATION)} />
            <NavBtn icon={BrainCircuit} label="Problem Solver" active={currentView === ViewState.PROBLEM_SOLVER} onClick={() => handleViewChange(ViewState.PROBLEM_SOLVER)} />
            <NavBtn icon={Feather} label="Project Lab" active={currentView === ViewState.PROJECT_LAB} onClick={() => handleViewChange(ViewState.PROJECT_LAB)} />
            <NavBtn icon={BookOpen} label="Logic Section" active={currentView === ViewState.SYLLABUS} onClick={() => handleViewChange(ViewState.SYLLABUS)} />
            <NavBtn icon={GraduationCap} label="Exams & Quizzes" active={currentView === ViewState.QUIZ} onClick={() => handleViewChange(ViewState.QUIZ)} />
            <NavBtn icon={PenTool} label="Notebook" active={currentView === ViewState.NOTEBOOK} onClick={() => handleViewChange(ViewState.NOTEBOOK)} />
            <NavBtn icon={Layers} label="Flashcards" active={currentView === ViewState.FLASHCARDS} onClick={() => handleViewChange(ViewState.FLASHCARDS)} />
            <div className="h-4"></div>
            <NavBtn icon={Settings} label="Settings" active={currentView === ViewState.SETTINGS} onClick={() => handleViewChange(ViewState.SETTINGS)} />
          </div>

          <div className="space-y-1">
             <div className="flex justify-between items-center px-2 mb-2">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider font-mono opacity-70">Your Subjects</p>
                <button onClick={() => handleViewChange(ViewState.SETTINGS)} className="text-[10px] text-blue-500 hover:underline">Edit</button>
             </div>
             {visibleSubjects.map((sub) => (
               <button
                key={sub.id}
                onClick={() => handleSubjectChange(sub.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden font-medium text-sm
                  ${currentSubject === sub.id ? 'bg-surfaceHighlight text-text-primary' : 'text-text-secondary hover:bg-surfaceHighlight hover:text-text-primary'}`}
               >
                 <sub.icon className={`w-4 h-4 ${currentSubject === sub.id ? sub.color : 'text-text-muted group-hover:text-text-primary'}`} />
                 <span className="relative z-10">{sub.id}</span>
                 {currentSubject === sub.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-purple-500 rounded-r-full" />}
               </button>
             ))}
          </div>
        </div>

        <div className="p-4 border-t border-border/10 bg-surfaceHighlight/30">
          <div className="flex items-center gap-3">
            {user ? (
              <>
                 <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-border/20" />
                 <div className="overflow-hidden">
                   <p className="text-sm font-bold text-text-primary truncate">{user.name}</p>
                   <p className="text-[10px] text-text-muted truncate">{user.stream || 'General'} Student</p>
                 </div>
              </>
            ) : (
               <div className="text-xs text-text-muted italic">Not signed in</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const NavBtn = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium
      ${active 
        ? 'bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-glow' 
        : 'text-text-secondary hover:text-text-primary hover:bg-surfaceHighlight'
      }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-purple-600 dark:text-purple-400' : 'text-text-muted'}`} />
    <span className="text-sm">{label}</span>
  </button>
);
