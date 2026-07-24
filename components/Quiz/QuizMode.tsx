
import React, { useState, useRef, useEffect } from 'react';
import { SubjectType, QuizQuestion, QuizResult, DifficultyLevel, ClassLevel } from '../../types';
import { SUBJECT_DETAILS, SYLLABUS_DATA } from '../../constants';
import { generateQuizQuestions } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, ArrowRight, RefreshCw, Check, X, Sparkles, Sliders, Zap, AlertTriangle, Play, BookOpen, Layers, GraduationCap, ChevronDown, Clock, Trophy, Target, FileQuestion, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface Props {
  subject: SubjectType;
}

const DIFFICULTIES: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Competitive', 'Elite'];
const CLASS_LEVELS: ClassLevel[] = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'University'];

const MathRenderer = ({ content, className = "" }: { content: string, className?: string }) => {
  if (!content) return null;

  const normalizedContent = content
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');

  const renderContent = () => {
    const parts = normalizedContent.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2);
        try {
          const html = (window as any).katex ? (window as any).katex.renderToString(math, { displayMode: true }) : math;
          return <div key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-3 overflow-x-auto text-center scrollbar-hide text-inherit" />;
        } catch (e) {
          return <span key={index} className="text-red-400 font-mono text-xs">{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        try {
           const html = (window as any).katex ? (window as any).katex.renderToString(math, { displayMode: false }) : math;
           return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="text-inherit" />;
        } catch (e) {
           return <span key={index} className="text-red-400 font-mono text-xs">{part}</span>;
        }
      } else {
        return <span key={index} className="text-inherit">{part}</span>;
      }
    });
  };
  return <div className={`whitespace-pre-wrap ${className}`}>{renderContent()}</div>;
};

export const QuizMode: React.FC<Props> = ({ subject }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'setup' | 'mistakes'>('setup');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const [topic, setTopic] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(user?.classLevel || 'Grade 11');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [isFullSyllabus, setIsFullSyllabus] = useState(false);

  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['mcq']);
  const [isExamMode, setIsExamMode] = useState(false);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isDiffDropdownOpen, setIsDiffDropdownOpen] = useState(false);
  const classDropdownRef = useRef<HTMLDivElement>(null);
  const diffDropdownRef = useRef<HTMLDivElement>(null);

  const syllabus = SYLLABUS_DATA[subject][selectedClass] || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target as Node)) {
        setIsClassDropdownOpen(false);
      }
      if (diffDropdownRef.current && !diffDropdownRef.current.contains(event.target as Node)) {
        setIsDiffDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleChapter = (title: string) => {
    setSelectedChapters(prev => 
      prev.includes(title) ? prev.filter(c => c !== title) : [...prev, title]
    );
  };

  const startQuiz = async () => {
    if (!topic && !isExamMode && selectedChapters.length === 0 && !isFullSyllabus) {
      alert("Please select a topic or chapters.");
      return;
    }
    setIsLoading(true);
    setHasError(false);
    
    let finalTopic = topic;
    const ncertPrefix = "NCERT Syllabus: ";

    if (isExamMode) {
      if (isFullSyllabus) {
        finalTopic = `${ncertPrefix} All Chapters for ${subject} ${selectedClass}`;
      } else if (selectedChapters.length > 0) {
        finalTopic = `${ncertPrefix} Chapters - ${selectedChapters.join(', ')}`;
      } else {
         finalTopic = `${ncertPrefix} General Assessment`;
      }
    } else if (selectedChapters.length > 0) {
       finalTopic = `${ncertPrefix} Chapters - ${selectedChapters.join(', ')}`;
    } else if (topic) {
       finalTopic = `${ncertPrefix} Specific Topic - ${topic}`;
    }

    const finalCount = isExamMode ? 30 : questionCount;
    const finalDiff = isExamMode ? 'Competitive' : difficulty;
    const finalTypes = isExamMode ? ['mcq', 'short_answer'] : ['mcq'];

    try {
      const qs = await generateQuizQuestions({
        subject,
        topic: finalTopic,
        count: finalCount,
        difficulty: finalDiff,
        types: finalTypes,
        classLevel: selectedClass
      });

      if (qs && qs.length > 0) {
        setQuestions(qs);
        setIsPlaying(true);
        setCurrentIndex(0);
        setAnswers({});
        setShowResult(false);
        setScore(0);
      } else {
        setHasError(true);
      }
    } catch (e) {
      console.error("Quiz generation failed", e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (val: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: val }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let correctCount = 0;
    const resultDetails: { 
      questionId: string; 
      userAnswer: string; 
      isCorrect: boolean;
      questionText: string;
      correctAnswer: string;
      explanation: string;
    }[] = [];
    
    questions.forEach(q => {
      const isCorrect = (answers[q.id] || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) correctCount++;
      resultDetails.push({
        questionId: q.id,
        userAnswer: answers[q.id] || '',
        isCorrect,
        questionText: q.text,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      });
    });

    setScore(correctCount);
    setShowResult(true);
    
    const result: QuizResult = {
      id: Date.now().toString(),
      subject,
      score: correctCount,
      totalQuestions: questions.length,
      date: Date.now(),
      answers: resultDetails,
      difficulty,
      classLevel: selectedClass
    };
    storageService.saveQuizResult(result);

    if (correctCount / questions.length > 0.8 && selectedChapters.length > 0) {
       selectedChapters.forEach(chapTitle => {
          const chap = syllabus.find(c => c.title === chapTitle);
          if (chap) storageService.markChapterMastered(chap.id);
       });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="relative">
           <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
           <Loader2 className="w-12 h-12 animate-spin text-yellow-400 relative z-10" />
        </div>
        <p className="text-text-primary font-bold mt-6 text-lg animate-pulse">Generating {isExamMode ? 'Exam' : 'Quiz'}...</p>
        <p className="text-text-muted text-sm mt-2">Tailoring questions for {selectedClass}</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
         <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
         </div>
         <h2 className="text-2xl font-bold text-text-primary mb-2">Generation Failed</h2>
         <p className="text-text-muted mb-8">
            The AI couldn't generate a valid quiz this time. This usually happens with complex custom topics.
         </p>
         <button onClick={() => setHasError(false)} className="px-6 py-3 bg-text-primary text-surface font-bold rounded-xl hover:opacity-90 transition">Try Again</button>
      </div>
    );
  }

  const renderMistakes = () => {
    const allResults = storageService.getQuizResults().filter(r => r.subject === subject);
    const allMistakes = allResults.flatMap(r => r.answers.filter(a => !a.isCorrect && a.questionText)).reverse();

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-surface border border-border/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <History className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Mistakes History</h2>
              <p className="text-sm text-text-muted">Review questions you've missed across all {subject} quizzes.</p>
            </div>
          </div>

          {allMistakes.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <Check className="w-12 h-12 mx-auto mb-4 text-green-500/50" />
              <p>You haven't made any mistakes yet. Keep up the great work!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allMistakes.map((mistake, idx) => (
                <div key={idx} className="bg-surfaceHighlight border border-border/10 rounded-xl p-5">
                  <div className="mb-4">
                    <MathRenderer content={mistake.questionText || ''} className="font-bold text-text-primary text-lg" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10 text-sm">
                      <span className="text-red-500 font-bold block mb-1">Your Answer</span>
                      <MathRenderer content={mistake.userAnswer || 'Skipped'} />
                    </div>
                    <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/10 text-sm">
                      <span className="text-green-500 font-bold block mb-1">Correct Answer</span>
                      <MathRenderer content={mistake.correctAnswer || ''} />
                    </div>
                  </div>
                  {mistake.explanation && (
                    <div className="mt-4 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10 text-sm text-text-secondary">
                      <span className="text-blue-500 font-bold block mb-1">Explanation</span>
                      {mistake.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isPlaying) {
    return (
      <div className="max-w-6xl mx-auto pb-24">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 w-fit">
                <GraduationCap className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-text-primary tracking-tight flex items-center gap-3">
                    Exams & Quizzes
                    <span className="text-xs font-bold px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20 uppercase tracking-widest">
                        Adaptive Testing
                    </span>
                </h1>
                <p className="text-text-muted mt-1 max-w-xl">
                    Create custom practice sessions or take full mock exams to test your mastery.
                </p>
            </div>
          </div>
          
          <div className="flex bg-surfaceHighlight p-1 rounded-xl border border-border/10 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('setup')}
              className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'setup' ? 'bg-surface text-text-primary shadow-sm border border-border/10' : 'text-text-muted hover:text-text-secondary'}`}
            >
              <Zap className="w-4 h-4" /> Setup
            </button>
            <button 
              onClick={() => setActiveTab('mistakes')}
              className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'mistakes' ? 'bg-surface text-text-primary shadow-sm border border-border/10' : 'text-text-muted hover:text-text-secondary'}`}
            >
              <History className="w-4 h-4" /> Mistakes
            </button>
          </div>
        </div>

        {activeTab === 'mistakes' ? renderMistakes() : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Config Column */}
           <div className="lg:col-span-5 space-y-6">
              <div className="bg-surface border border-border/10 rounded-2xl p-6 shadow-xl relative group">
                 {/* Background glow effect - Clipped in separate container */}
                 <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/5 blur-3xl rounded-full group-hover:bg-yellow-500/10 transition-all duration-700" />
                 </div>

                 <div className="space-y-6 relative z-10">
                    {/* Mode Toggle */}
                    <div className="bg-surfaceHighlight p-1 rounded-xl border border-border/10 flex">
                        <button 
                           onClick={() => setIsExamMode(false)}
                           className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                              ${!isExamMode ? 'bg-surface text-text-primary shadow-sm border border-border/10' : 'text-text-muted hover:text-text-secondary'}`}
                        >
                           <Sliders className="w-4 h-4" /> Practice
                        </button>
                        <button 
                           onClick={() => setIsExamMode(true)}
                           className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                              ${isExamMode ? 'bg-red-500/20 text-red-500 shadow-sm border border-red-500/20' : 'text-text-muted hover:text-text-secondary'}`}
                        >
                           <AlertTriangle className="w-4 h-4" /> Exam Mode
                        </button>
                    </div>

                    {/* Class Level Dropdown */}
                    <div className="relative" ref={classDropdownRef}>
                       <label className="block text-xs font-bold text-text-secondary uppercase mb-2 tracking-wider">Class Level</label>
                       <button 
                         onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                         className={`w-full flex items-center justify-between bg-surfaceHighlight border rounded-xl p-4 text-text-primary transition-all duration-200
                             ${isClassDropdownOpen ? 'border-yellow-500 ring-1 ring-yellow-500/50' : 'border-border/10 hover:border-border/20'}`}
                       >
                          <div className="flex items-center gap-3">
                             <GraduationCap className="w-5 h-5 text-yellow-400" />
                             <span className="font-medium">{selectedClass}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isClassDropdownOpen ? 'rotate-180' : ''}`} />
                       </button>

                       <AnimatePresence>
                         {isClassDropdownOpen && (
                             <MotionDiv 
                                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                 transition={{ duration: 0.1 }}
                                 className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                             >
                                 <div className="p-1 space-y-1">
                                     {CLASS_LEVELS.map((level) => (
                                         <button
                                             key={level}
                                             onClick={() => { setSelectedClass(level); setSelectedChapters([]); setIsClassDropdownOpen(false); }}
                                             className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all
                                                 ${selectedClass === level 
                                                     ? 'bg-yellow-600/20 text-yellow-500 shadow-glow' 
                                                     : 'text-text-secondary hover:bg-surfaceHighlight hover:text-text-primary'}`}
                                         >
                                             <GraduationCap className={`w-4 h-4 ${selectedClass === level ? 'text-yellow-500' : 'text-text-muted'}`} />
                                             {level}
                                         </button>
                                     ))}
                                 </div>
                             </MotionDiv>
                         )}
                       </AnimatePresence>
                    </div>

                    {!isExamMode && (
                        <MotionDiv initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                           {/* Difficulty Dropdown */}
                           <div className="relative" ref={diffDropdownRef}>
                              <label className="block text-xs font-bold text-text-secondary uppercase mb-2 tracking-wider">Difficulty</label>
                              <button 
                                onClick={() => setIsDiffDropdownOpen(!isDiffDropdownOpen)}
                                className={`w-full flex items-center justify-between bg-surfaceHighlight border rounded-xl p-4 text-text-primary transition-all duration-200
                                    ${isDiffDropdownOpen ? 'border-yellow-500 ring-1 ring-yellow-500/50' : 'border-border/10 hover:border-border/20'}`}
                              >
                                 <div className="flex items-center gap-3">
                                    <Target className="w-5 h-5 text-yellow-400" />
                                    <span className="font-medium">{difficulty}</span>
                                 </div>
                                 <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isDiffDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              <AnimatePresence>
                                {isDiffDropdownOpen && (
                                    <MotionDiv 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="p-1 space-y-1">
                                            {DIFFICULTIES.map((diff) => (
                                                <button
                                                    key={diff}
                                                    onClick={() => { setDifficulty(diff); setIsDiffDropdownOpen(false); }}
                                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all
                                                        ${difficulty === diff 
                                                            ? 'bg-yellow-600/20 text-yellow-500 shadow-glow' 
                                                            : 'text-text-secondary hover:bg-surfaceHighlight hover:text-text-primary'}`}
                                                >
                                                    <Target className={`w-4 h-4 ${difficulty === diff ? 'text-yellow-500' : 'text-text-muted'}`} />
                                                    {diff}
                                                </button>
                                            ))}
                                        </div>
                                    </MotionDiv>
                                )}
                              </AnimatePresence>
                           </div>

                           {/* Question Count Slider */}
                           <div>
                              <div className="flex justify-between items-center mb-2">
                                 <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">Question Count</label>
                                 <span className="text-xs font-bold text-text-primary bg-surfaceHighlight px-2 py-0.5 rounded border border-border/10">{questionCount} Qs</span>
                              </div>
                              <input 
                                type="range" 
                                min="5" 
                                max="50" 
                                step="5" 
                                value={questionCount} 
                                onChange={(e) => setQuestionCount(parseInt(e.target.value))} 
                                className="w-full h-2 bg-surfaceHighlight rounded-lg appearance-none cursor-pointer accent-yellow-400" 
                              />
                           </div>

                           {/* Topic Input */}
                           <div>
                             <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">Specific Topic (Optional)</label>
                             <div className="relative">
                                <input 
                                    type="text" 
                                    value={topic} 
                                    onChange={(e) => setTopic(e.target.value)} 
                                    placeholder="e.g. Thermodynamics..." 
                                    className="w-full bg-surfaceHighlight border border-border/10 rounded-xl p-4 text-text-primary text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all placeholder-text-muted/50" 
                                />
                                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
                             </div>
                           </div>
                        </MotionDiv>
                    )}

                    <button 
                        onClick={startQuiz} 
                        disabled={isLoading}
                        className={`w-full py-4 text-white font-bold rounded-xl shadow-glow-accent transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed
                            ${isExamMode 
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500' 
                                : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black'}`}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isExamMode ? <AlertTriangle className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />)}
                        {isExamMode ? 'Start Exam' : 'Generate Quiz'}
                    </button>
                 </div>
              </div>
           </div>

           {/* Syllabus / Content Column */}
           <div className="lg:col-span-7">
              <div className="bg-surface border border-border/10 rounded-2xl p-6 h-full flex flex-col shadow-lg">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-400" /> 
                        {isExamMode ? 'Exam Coverage' : 'Target Chapters'}
                    </h3>
                    {isExamMode && (
                        <div className="flex bg-surfaceHighlight p-1 rounded-lg">
                            <button 
                                onClick={() => { setIsFullSyllabus(true); setSelectedChapters([]); }}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${isFullSyllabus ? 'bg-blue-500 text-white' : 'text-text-muted hover:text-text-primary'}`}
                            >
                                All
                            </button>
                            <button 
                                onClick={() => setIsFullSyllabus(false)}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${!isFullSyllabus ? 'bg-blue-500 text-white' : 'text-text-muted hover:text-text-primary'}`}
                            >
                                Select
                            </button>
                        </div>
                    )}
                 </div>

                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 bg-surfaceHighlight rounded-xl p-2 border border-border/10">
                    {syllabus.length > 0 ? (
                        syllabus.map(chap => (
                            <label 
                                key={chap.id} 
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all group
                                    ${selectedChapters.includes(chap.title) || (isExamMode && isFullSyllabus)
                                        ? 'bg-blue-500/10 border-blue-500/30' 
                                        : 'bg-transparent border-transparent hover:bg-surface hover:border-border/10'}`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0
                                    ${selectedChapters.includes(chap.title) || (isExamMode && isFullSyllabus)
                                        ? 'bg-blue-500 border-blue-500' 
                                        : 'border-border/30 group-hover:border-border/50'}`}>
                                    {(selectedChapters.includes(chap.title) || (isExamMode && isFullSyllabus)) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={selectedChapters.includes(chap.title)}
                                    onChange={() => {
                                        if (isExamMode && isFullSyllabus) return; // Prevent selection in Full mode
                                        toggleChapter(chap.title);
                                    }}
                                    disabled={isExamMode && isFullSyllabus}
                                />
                                <span className={`text-sm font-medium ${selectedChapters.includes(chap.title) || (isExamMode && isFullSyllabus) ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                                    {chap.title}
                                </span>
                            </label>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                            <Layers className="w-10 h-10 mb-2" />
                            <p className="text-sm">No chapters found for {selectedClass} {subject}.</p>
                        </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
        )}
      </div>
    );
  }

  // Result and Playing view
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 pb-24">
         <div className="text-center mb-10">
            <div className="inline-block p-4 rounded-full border-4 border-border/10 mb-4 relative bg-surface">
                <span className="text-5xl font-bold text-text-primary">{percentage}%</span>
                {percentage > 80 && <Sparkles className="absolute -top-2 -right-2 text-yellow-400 w-10 h-10 animate-bounce" />}
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">{percentage >= 90 ? 'Mastery Achieved!' : 'Keep Practicing'}</h2>
            <p className="text-text-muted">You scored {score} out of {questions.length} for {selectedClass}</p>
         </div>
         <button onClick={() => setIsPlaying(false)} className="w-full bg-text-primary text-background py-4 rounded-xl hover:opacity-90 transition font-bold flex items-center justify-center gap-2 mb-8 shadow-glow">
            <RefreshCw className="w-5 h-5" /> Build Another Quiz
         </button>
         <div className="space-y-4">
            {questions.map((q) => {
              const isCorrect = (answers[q.id] || '').trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
              return (
                <div key={q.id} className={`bg-surface rounded-xl border ${isCorrect ? 'border-border/10' : 'border-red-500/20'} p-6`}>
                   <div className="flex gap-4">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                         {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between mb-2">
                            <MathRenderer content={q.text} className="font-bold text-text-primary text-lg" />
                         </div>
                         {!isCorrect && <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10 text-sm"><span className="text-red-500 font-bold block mb-1">Your Answer</span>{answers[q.id] || 'Skipped'}</div>}
                         <div className="mt-2 p-3 bg-green-500/5 rounded-lg border border-green-500/10 text-sm"><span className="text-green-500 font-bold block mb-1">Correct Answer</span>{q.correctAnswer}</div>
                         <div className="mt-4 text-xs text-text-muted italic bg-surfaceHighlight p-3 rounded-lg border border-border/10">{q.explanation}</div>
                      </div>
                   </div>
                </div>
              );
            })}
         </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col min-h-[70vh] pb-24">
       <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-text-secondary bg-surfaceHighlight px-3 py-1 rounded-lg border border-border/10">Q{currentIndex + 1} / {questions.length}</span>
             <span className={`text-xs font-bold px-2 py-1 rounded border ${isExamMode ? 'border-red-500/30 text-red-500 bg-red-500/10' : 'border-blue-500/30 text-blue-500 bg-blue-500/10'}`}>
                {isExamMode ? 'Exam' : 'Practice'}
             </span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-text-secondary">
             {isExamMode && <Clock className="w-4 h-4" />}
             <span className="px-3 py-1 bg-surfaceHighlight rounded-full border border-border/10">{currentQ.difficulty}</span>
          </div>
       </div>

       <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
             <MotionDiv key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <div className="mb-8 p-6 bg-surface border border-border/10 rounded-2xl shadow-lg">
                   <MathRenderer content={currentQ.text} className="text-xl md:text-2xl font-bold text-text-primary leading-relaxed" />
                </div>

                {currentQ.options && currentQ.options.length > 0 ? (
                   <div className="grid grid-cols-1 gap-3">
                      {currentQ.options.map((opt, i) => (
                         <button 
                            key={i} 
                            onClick={() => handleAnswer(opt)} 
                            className={`w-full text-left p-5 rounded-xl border transition-all text-lg flex items-center gap-4 group
                                ${answers[currentQ.id] === opt 
                                    ? 'border-text-primary bg-text-primary text-background shadow-glow scale-[1.02]' 
                                    : 'border-border/10 bg-surface text-text-primary hover:bg-surfaceHighlight hover:border-border/20'}`}
                         >
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors
                                ${answers[currentQ.id] === opt ? 'border-background' : 'border-border/30 group-hover:border-text-primary'}`}>
                                {answers[currentQ.id] === opt && <div className="w-3 h-3 bg-background rounded-full" />}
                            </div>
                            <MathRenderer content={opt} />
                         </button>
                      ))}
                   </div>
                ) : (
                   <div className="mt-4">
                       <input 
                         type="text" 
                         value={answers[currentQ.id] || ''}
                         onChange={(e) => handleAnswer(e.target.value)}
                         placeholder="Type your answer here..."
                         className="w-full bg-surfaceHighlight border border-border/10 rounded-xl p-5 text-lg text-text-primary focus:outline-none focus:border-border/30 placeholder-text-muted/50 shadow-inner"
                       />
                       <p className="text-xs text-text-muted mt-2 ml-1">Type your answer carefully.</p>
                   </div>
                )}
             </MotionDiv>
          </AnimatePresence>
       </div>

       <div className="mt-8 flex justify-between items-center border-t border-border/10 pt-6">
          <button onClick={nextQuestion} className="text-text-muted hover:text-text-primary text-sm px-4 py-2 hover:bg-surfaceHighlight rounded-lg transition-colors">Skip Question</button>
          <button onClick={nextQuestion} className="flex items-center gap-2 bg-text-primary text-background px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-glow">
             {currentIndex === questions.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="w-5 h-5" />
          </button>
       </div>
    </div>
  );
};
