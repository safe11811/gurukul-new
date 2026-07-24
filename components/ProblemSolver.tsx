
import React, { useState, useRef, useEffect } from 'react';
import { SubjectType, ProblemSolution } from '../types';
import { SUBJECT_DETAILS } from '../constants';
import { solveProblemWithAI } from '../services/aiService';
import { storageService, ChatSession } from '../services/storageService';
import { Loader2, Sparkles, Lightbulb, History, ChevronRight, X, Brain, Eraser, Calculator, ChevronDown, AlertTriangle, Hexagon, ArrowRightLeft, MoveRight, FlaskConical, Atom, Code, Terminal, Play, Upload, Image as ImageIcon, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  subject: SubjectType;
}

// Safe Block Math Component
const BlockMath: React.FC<{ math: string }> = ({ math }) => {
    try {
        const html = (window as any).katex 
            ? (window as any).katex.renderToString(math, { 
                displayMode: true, 
                throwOnError: false, 
                output: 'html',
                trust: true
              }) 
            : math;
        return (
            <div 
              dangerouslySetInnerHTML={{ __html: html }} 
              className="my-6 py-2 overflow-x-auto text-center scrollbar-hide text-xl md:text-2xl text-text-primary w-full" 
            />
        );
    } catch (e) {
        return <div className="text-red-400 font-mono text-xs p-2 border border-red-500/20 rounded bg-red-500/5 overflow-x-auto">{math}</div>;
    }
};

// Safe Inline Math Component
const InlineMath: React.FC<{ math: string }> = ({ math }) => {
    try {
        const html = (window as any).katex 
            ? (window as any).katex.renderToString(math, { 
                displayMode: false, 
                throwOnError: false,
                trust: true
              }) 
            : math;
        return <span dangerouslySetInnerHTML={{ __html: html }} className="mx-1 text-lg text-text-primary align-middle" />;
    } catch (e) {
        return <span className="text-red-400 font-mono text-xs">{math}</span>;
    }
};

// --- Enhanced Math Renderer ---
const MathRenderer: React.FC<{ content: string, className?: string }> = ({ content, className = "" }) => {
  if (!content) return null;

  // Normalization: 
  // 1. Replace \[ ... \] with $$ ... $$
  // 2. Replace \( ... \) with $ ... $
  const normalizedContent = content
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');

  const renderContent = () => {
    // Check for Code Blocks first
    if (content.includes('```')) {
       const codeParts = content.split(/(```[\s\S]*?```)/g);
       return codeParts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
             const codeContent = part.replace(/```[a-z]*\n?/, '').replace(/```$/, '');
             return (
               <div key={index} className="my-4 bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto shadow-inner border border-gray-700">
                  <pre>{codeContent}</pre>
               </div>
             );
          }
          return <MathRenderer key={index} content={part} />;
       });
    }

    // Split by:
    // 1. $$ ... $$ (Display Math)
    // 2. $ ... $ (Inline Math)
    // 3. \begin{env} ... \end{env} (LaTeX Environments like align, equation, etc.)
    const parts = normalizedContent.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|\\begin\{[a-z]+\*?\}(?:[\s\S]*?)\\end\{[a-z]+\*?\})/gi);
    
    return parts.map((part, index) => {
      // Display Math ($$ or \begin{...})
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2);
        return <BlockMath key={index} math={math} />;
      } 
      else if (part.match(/^\\begin\{[a-z]+\*?\}/i)) {
        // Direct environment (e.g., \begin{align*}...\end{align*})
        // KaTeX renders these in display mode by default usually, but we force it.
        return <BlockMath key={index} math={part} />;
      }
      // Inline Math ($)
      else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        return <InlineMath key={index} math={math} />;
      } 
      // Text
      else {
        return <span key={index} className="font-sans leading-relaxed text-text-primary">{part}</span>;
      }
    });
  };

  return <div className={`whitespace-pre-wrap break-words ${className}`}>{renderContent()}</div>;
};

export const ProblemSolver: React.FC<Props> = ({ subject }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<ProblemSolution | null>(null);
  const [useAnalogy, setUseAnalogy] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const config = SUBJECT_DETAILS[subject];
  const isCS = subject === SubjectType.CS;

  useEffect(() => {
    const allHistory = storageService.getChatHistory();
    setHistory(allHistory.filter(h => h.subject === subject));
  }, [subject]);

  const handleSolve = async () => {
    if (!input.trim() && !selectedImage) return;
    setIsLoading(true);
    setError(null);
    setSolution(null);
    setSelectedNodeId(null);

    try {
      const result = await solveProblemWithAI(input, subject, useAnalogy ? 'analogy' : 'normal', selectedImage || undefined);
      
      if (result) {
        setSolution(result);
        const newSession: ChatSession = {
          id: Date.now().toString(),
          subject,
          query: input || (selectedImage ? "Image Analysis" : "Problem"),
          solution: result,
          timestamp: Date.now()
        };
        storageService.saveChatHistory(newSession);
        setHistory(prev => [newSession, ...prev]);
        // Note: We intentionally do NOT clear selectedImage here so it persists in the view
      } else {
        setError("Could not generate a solution. Please try again.");
      }
    } catch (err) {
      console.error("Solver exception:", err);
      setError("An unexpected error occurred. Using offline mode.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = (session: ChatSession) => {
    setInput(session.query);
    setSolution(session.solution);
    setShowHistory(false);
    setSelectedNodeId(null);
    setError(null);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        alert("Please upload an image file.");
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
      e.target.value = ''; // Reset input
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          processFile(blob);
          e.preventDefault(); 
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
    }
  };

  const insertAtCursor = (text: string, cursorOffset: number = 0) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newContent = input.substring(0, start) + text + input.substring(end);
    setInput(newContent);
    
    setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            const newCursor = start + text.length + cursorOffset;
            textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
    }, 0);
  };

  // --- Toolbars ---
  
  const latexTools = [
    { label: 'Inline Math', value: '$ $', offset: -1, icon: '$x$' },
    { label: 'Block Math', value: '$$\n\n$$', offset: -3, icon: '$$x$$' },
    { label: 'Fraction', value: '\\frac{}{}', offset: -3, icon: '½' },
    { label: 'Sqrt', value: '\\sqrt{}', offset: -1, icon: '√' },
    { label: 'Power', value: '^{}', offset: -1, icon: 'x²' },
    { label: 'Integral', value: '\\int ', offset: 0, icon: '∫' },
    { label: 'Arrow', value: '\\rightarrow ', offset: 0, icon: '→' },
  ];

  // Enhanced Organic Chemistry Tools
  const organicStructures = [
    { label: 'Benzene', value: 'C₆H₆', icon: <Hexagon className="w-4 h-4 text-purple-500" /> },
    { label: 'Cyclohexane', value: 'C₆H₁₂', icon: <Hexagon className="w-4 h-4 text-gray-400" /> },
    { label: 'Single', value: '-', icon: '—' },
    { label: 'Double', value: '=', icon: '=' },
    { label: 'Triple', value: '≡', icon: '≡' },
    { label: 'Reaction', value: ' → ', icon: <MoveRight className="w-4 h-4"/> },
    { label: 'Eq', value: ' ⇌ ', icon: <ArrowRightLeft className="w-4 h-4"/> },
  ];

  const organicGroups = [
    { label: 'Methyl', value: '-CH₃' },
    { label: 'Ethyl', value: '-C₂H₅' },
    { label: 'Hydroxyl', value: '-OH' },
    { label: 'Carboxyl', value: '-COOH' },
    { label: 'Amino', value: '-NH₂' },
    { label: 'Aldehyde', value: '-CHO' },
    { label: 'Nitro', value: '-NO₂' },
    { label: 'Phenyl', value: '-Ph' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-24 relative min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
         <div>
           <h1 className="text-3xl font-bold text-text-primary tracking-tight flex items-center gap-3">
             {isCS ? 'Code Generator' : (config?.actionLabel || 'Problem Solver')}
             <span className={`text-xs font-bold px-2 py-1 rounded-full border uppercase tracking-widest ${isCS ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                {isCS ? 'Codestral AI' : 'AI Powered'}
             </span>
           </h1>
           <p className="text-text-muted mt-1">{isCS ? "Generate robust code solutions and algorithms instantly." : "Get detailed step-by-step solutions for complex problems."}</p>
         </div>
         
         <div className="flex gap-2">
            <button onClick={() => setShowHistory(!showHistory)} className="px-4 py-2 rounded-lg border border-border/10 bg-surface text-text-muted hover:text-text-primary flex items-center gap-2 font-medium text-sm">
              <History className="w-4 h-4" /> History
            </button>
            {!isCS && (
                <button 
                onClick={() => setUseAnalogy(!useAnalogy)}
                className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 font-medium text-sm ${useAnalogy ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 'bg-surface border-border/10 text-text-muted hover:text-text-primary'}`}
                >
                <Lightbulb className="w-4 h-4" /> Analogy Mode
                </button>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Input Column */}
         <div className="lg:col-span-4 space-y-4">
            <div 
                className={`bg-surface rounded-xl border transition-all duration-200 shadow-lg overflow-hidden flex flex-col h-[600px] relative
                    ${isDragging ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-border/10'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Drag Overlay */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-surface/90 z-50 flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none"
                        >
                            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 border border-purple-500/20 animate-bounce">
                                <Upload className="w-10 h-10 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary">Drop Image Here</h3>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Standard Math Toolbar */}
                {!isCS && subject !== SubjectType.CHEMISTRY && (
                    <div className="bg-surfaceHighlight border-b border-border/10 p-2 flex gap-1 overflow-x-auto scrollbar-hide">
                        {latexTools.map((tool, i) => (
                        <button key={i} onClick={() => insertAtCursor(tool.value, tool.offset)} className="flex items-center justify-center px-3 py-1.5 rounded bg-surface hover:bg-surfaceHighlight text-text-secondary hover:text-text-primary text-xs font-medium border border-border/10 transition-colors min-w-[32px]">
                            {tool.icon}
                        </button>
                        ))}
                    </div>
                )}

                {/* Enhanced Organic Chemistry Toolbar */}
                {subject === SubjectType.CHEMISTRY && (
                  <div className="bg-green-500/5 border-b border-green-500/10 p-2 space-y-2">
                     {/* Basic Structures & Bonds */}
                     <div className="flex gap-1 overflow-x-auto scrollbar-hide items-center">
                        {organicStructures.map((tool, i) => (
                           <button key={`chem-${i}`} onClick={() => insertAtCursor(tool.value, 0)} className="flex items-center justify-center px-2 py-1.5 rounded bg-surface hover:bg-surfaceHighlight text-text-secondary hover:text-text-primary text-xs font-medium border border-border/10 transition-colors min-w-[32px] mr-1" title={tool.label}>
                             {tool.icon}
                           </button>
                        ))}
                     </div>
                     {/* Functional Groups & Branches */}
                     <div className="flex flex-wrap gap-1.5 px-1 pb-1">
                        {organicGroups.map((group, i) => (
                           <button 
                             key={`func-${i}`} 
                             onClick={() => insertAtCursor(group.value, 0)} 
                             className="px-2.5 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[11px] font-bold border border-green-200 dark:border-green-800 transition-transform active:scale-95"
                           >
                             {group.label}
                           </button>
                        ))}
                     </div>
                  </div>
                )}

                {/* Code Toolbar */}
                {isCS && (
                    <div className="bg-purple-500/5 border-b border-purple-500/10 p-2 flex gap-1 overflow-x-auto scrollbar-hide">
                        {['Python', 'Java', 'C++', 'SQL', 'JavaScript'].map((lang, i) => (
                            <button key={i} onClick={() => insertAtCursor(lang + ": ", 0)} className="px-3 py-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform">
                                {lang}
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative flex-1 bg-surface flex flex-col">
                  {selectedImage && (
                    <div className="p-4 border-b border-border/10 bg-surfaceHighlight/50 relative group">
                      <div className="relative w-full h-32 bg-background/50 rounded-lg overflow-hidden border border-border/10 flex items-center justify-center">
                        <img src={selectedImage} alt="Problem Context" className="max-w-full max-h-full object-contain" />
                      </div>
                      <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <textarea 
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPaste={handlePaste}
                    placeholder={selectedImage ? "Add any specific questions about this image..." : (isCS ? "Describe the program you want to generate..." : (subject === SubjectType.CHEMISTRY ? "Draw molecule or ask mechanism..." : "Describe your problem or paste an image..."))}
                    className="w-full flex-1 bg-transparent text-base p-4 resize-none focus:outline-none text-text-primary placeholder-text-muted/40 font-mono leading-relaxed custom-scrollbar"
                  />
                </div>
                <div className="p-4 bg-surfaceHighlight border-t border-border/10 flex justify-between items-center">
                   <div className="flex gap-2">
                     <button onClick={() => { setInput(''); setSelectedImage(null); }} className="p-2 hover:bg-surface rounded-lg text-text-muted transition-colors"><Eraser className="w-5 h-5" /></button>
                     
                     <div className="relative flex gap-1">
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         accept="image/*" 
                         className="hidden" 
                         onChange={handleImageSelect}
                       />
                       <input 
                         type="file" 
                         ref={cameraInputRef} 
                         accept="image/*" 
                         capture="environment"
                         className="hidden" 
                         onChange={handleImageSelect}
                       />
                       <button 
                         onClick={() => fileInputRef.current?.click()} 
                         className={`p-2 rounded-lg transition-colors ${selectedImage ? 'bg-purple-500/20 text-purple-500' : 'text-text-muted hover:bg-surface'}`}
                         title="Upload Image"
                       >
                         <ImageIcon className="w-5 h-5" />
                       </button>
                       <button 
                         onClick={() => cameraInputRef.current?.click()} 
                         className={`p-2 rounded-lg transition-colors text-text-muted hover:bg-surface`}
                         title="Take Photo"
                       >
                         <Camera className="w-5 h-5" />
                       </button>
                     </div>
                   </div>
                   <button onClick={handleSolve} disabled={isLoading || (!input && !selectedImage)} className="bg-text-primary text-surface px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-glow hover:scale-105 active:scale-95">
                      {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</> : <>{isCS ? <Code className="w-4 h-4"/> : <Sparkles className="w-4 h-4" />} {isCS ? 'Generate Code' : 'Solve Now'}</>}
                   </button>
                </div>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3">
                 <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                 <p className="text-sm text-red-500 dark:text-red-200">{error}</p>
              </div>
            )}
         </div>

         {/* Results Column */}
         <div className="lg:col-span-8 relative min-h-[500px]">
           <AnimatePresence mode="wait">
             {solution ? (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  {/* Final Answer / Code Block */}
                  <div className={`p-1 rounded-2xl shadow-xl ${isCS ? 'bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20' : 'bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20'}`}>
                    <div className="bg-surface rounded-xl p-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-5">
                           {isCS ? <Terminal className="w-40 h-40" /> : <Brain className="w-40 h-40" />}
                       </div>
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 border shadow-sm ${isCS ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                          {isCS ? <Code className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />} 
                          {isCS ? 'Generated Code' : 'Final Result'}
                       </span>
                       {/* Increased size for Final Answer */}
                       <div className="relative z-10 w-full">
                          <MathRenderer content={solution.finalAnswer} className="text-2xl md:text-3xl font-bold text-text-primary leading-tight" />
                       </div>
                    </div>
                  </div>

                  {/* Responsive Flowchart Layout */}
                  <div className="relative pb-10">
                     <div className="space-y-10 relative z-10">
                        {/* Question Node - Explicitly visualizes the problem */}
                        <div className="relative pl-24 pb-4">
                            {/* Line connecting to Step 1 */}
                            {solution.steps.length > 0 && (
                                <div className="absolute left-[38px] top-16 bottom-[-4rem] w-1 bg-gradient-to-b from-red-500/50 to-border/20 -z-10 rounded-full" />
                            )}

                            {/* Node Circle */}
                            <div className="absolute left-2 top-0 w-16 h-16 rounded-full border-4 border-surface flex items-center justify-center z-10 bg-gradient-to-br from-red-500 to-orange-500 shadow-xl text-white">
                                <span className="font-bold text-2xl">?</span>
                            </div>

                            {/* Connector Arm */}
                            <div className="absolute left-[50px] top-8 w-12 h-0.5 bg-border/20 z-0" />

                            {/* Content Card */}
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-surface border border-red-500/20 rounded-2xl overflow-hidden shadow-md"
                            >
                                <div className="p-6">
                                    <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">Problem Statement</h3>
                                    <MathRenderer content={solution.problemStatement} className="text-xl font-bold text-text-primary leading-relaxed" />
                                    
                                    {selectedImage && (
                                        <div className="mt-4 rounded-xl overflow-hidden border border-border/10 bg-black/5">
                                            <img src={selectedImage} alt="Problem Context" className="max-w-full max-h-80 object-contain mx-auto" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {solution.steps.map((step, idx) => (
                          <div key={idx} className="relative pl-24 pb-4">
                              {/* Dynamic Connecting Line */}
                              {idx < solution.steps.length - 1 && (
                                <div className="absolute left-[38px] top-16 bottom-[-4rem] w-1 bg-gradient-to-b from-border/40 to-border/10 -z-10 rounded-full" />
                              )}

                              {/* Node Circle */}
                              <div 
                                onClick={() => setSelectedNodeId(selectedNodeId === step.id ? null : step.id)}
                                className={`absolute left-2 top-0 w-16 h-16 rounded-full border-4 border-surface flex items-center justify-center z-10 cursor-pointer transition-all duration-300 shadow-xl
                                ${selectedNodeId === step.id ? 'scale-110 ring-4 ring-purple-500/30' : 'hover:scale-105'}
                                ${step.type === 'concept' ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 
                                  step.type === 'formula' ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 
                                  step.type === 'result' ? 'bg-gradient-to-br from-green-500 to-green-700' : 'bg-gradient-to-br from-gray-500 to-gray-700'}`} 
                              >
                                <span className="text-white font-bold text-xl">{idx + 1}</span>
                              </div>
                              
                              {/* Connector Arm */}
                              <div className="absolute left-[50px] top-8 w-12 h-0.5 bg-border/20 z-0" />

                              {/* Content Card - Increased padding and size */}
                              <motion.div 
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`bg-surface border rounded-2xl overflow-hidden transition-all duration-300 group shadow-md hover:shadow-lg
                                  ${selectedNodeId === step.id ? 'border-purple-500/30 shadow-glow' : 'border-border/10 hover:border-border/20'}`}
                              >
                                <div className="p-6 cursor-pointer" onClick={() => setSelectedNodeId(selectedNodeId === step.id ? null : step.id)}>
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider ${step.type === 'concept' ? 'bg-blue-500/10 text-blue-500' : step.type === 'formula' ? 'bg-purple-500/10 text-purple-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                            {step.type}
                                          </span>
                                          <h3 className="font-bold text-text-primary text-xl">{step.label}</h3>
                                      </div>
                                      {selectedNodeId === step.id ? <ChevronDown className="w-5 h-5 text-text-muted" /> : <ChevronRight className="w-5 h-5 text-text-muted opacity-50 group-hover:opacity-100" />}
                                    </div>
                                    {/* Increased min-height and text size for steps */}
                                    <div className="min-h-[60px]">
                                       <MathRenderer content={step.description} className="text-text-secondary text-lg leading-relaxed" />
                                    </div>
                                </div>
                                <AnimatePresence>
                                  {selectedNodeId === step.id && (
                                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-surfaceHighlight border-t border-border/10">
                                        <div className="p-6 flex gap-4">
                                            <div className="shrink-0 w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20"><Sparkles className="w-5 h-5" /></div>
                                            <div>
                                              <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2">{isCS ? "Logic & Strategy" : "Why this works"}</h4>
                                              <MathRenderer content={step.why || "This step establishes the logical foundation."} className="text-base text-text-primary/90 leading-relaxed" />
                                            </div>
                                        </div>
                                      </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                          </div>
                        ))}
                     </div>
                  </div>
               </motion.div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/5 rounded-2xl bg-surface/[0.02]">
                  <div className="w-24 h-24 bg-surfaceHighlight rounded-full flex items-center justify-center mb-6 shadow-xl animate-pulse-slow ring-8 ring-border/5">
                     {isCS ? <Terminal className="w-10 h-10 text-purple-500" /> : (subject === SubjectType.CHEMISTRY ? <FlaskConical className="w-10 h-10 text-green-500" /> : <Brain className="w-10 h-10 text-text-muted" />)}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">{isCS ? 'Ready to Code' : 'Ready to Solve'}</h3>
                  <p className="text-text-muted text-center max-w-sm">{isCS ? "Enter a problem description on the left. I'll generate clean, commented code." : "Enter a problem on the left. I'll break it down into a visual step-by-step flowchart."}</p>
               </div>
             )}
           </AnimatePresence>
         </div>
      </div>
      
      {/* History Drawer */}
      <AnimatePresence>
         {showHistory && (
            <>
              <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm lg:hidden" onClick={() => setShowHistory(false)} />
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-y-0 right-0 w-80 bg-surface border-l border-border/10 shadow-2xl z-50 flex flex-col">
                 <div className="p-5 border-b border-border/10 flex justify-between items-center bg-surfaceHighlight">
                    <h3 className="font-bold text-text-primary flex items-center gap-2"><History className="w-4 h-4 text-blue-400" /> Recent {isCS ? 'Code' : 'Problems'}</h3>
                    <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-surface rounded"><X className="w-5 h-5 text-text-muted" /></button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {history.map((h) => (
                      <button key={h.id} onClick={() => loadSession(h)} className="w-full text-left p-4 rounded-xl hover:bg-surfaceHighlight border border-transparent hover:border-border/10 transition-all group">
                         <p className="text-sm font-medium text-text-primary truncate mb-1 group-hover:text-blue-500 transition-colors">{h.query}</p>
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] text-text-muted bg-surfaceHighlight px-2 py-0.5 rounded">{new Date(h.timestamp).toLocaleDateString()}</span>
                            <ChevronRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100" />
                         </div>
                      </button>
                    ))}
                 </div>
              </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
};

