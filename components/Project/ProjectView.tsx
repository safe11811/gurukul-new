
import React, { useState, useRef, useEffect } from 'react';
import { SubjectType } from '../../types';
import { generateHumanLikeDraft } from '../../services/aiService';
import { Loader2, Copy, Sparkles, Feather, FileText, Check, ChevronDown, Book, FlaskConical, Briefcase, FileSpreadsheet, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface Props {
  subject: SubjectType;
}

export const ProjectView: React.FC<Props> = ({ subject }) => {
  const [assignmentType, setAssignmentType] = useState('Essay');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'Simple' | 'Academic' | 'Creative'>('Academic');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; content: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const assignmentOptions = [
    { id: 'Essay', label: 'Essay', icon: Book },
    { id: 'Lab Report', label: 'Lab Report', icon: FlaskConical },
    { id: 'Case Study', label: 'Case Study', icon: Briefcase },
    { id: 'Project Proposal', label: 'Project Proposal', icon: FileSpreadsheet },
    { id: 'Speech/Script', label: 'Speech / Script', icon: Mic },
  ];

  const selectedOption = assignmentOptions.find(opt => opt.id === assignmentType) || assignmentOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setResult(null);
    
    try {
      const draft = await generateHumanLikeDraft(subject, assignmentType, topic, tone);
      setResult(draft);
    } catch (e) {
      console.error("Generation failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.title}\n\n${result.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
       <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 w-fit">
                <Feather className="w-8 h-8 text-purple-500" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-text-primary tracking-tight flex items-center gap-3">
                    Project Lab
                    <span className="text-xs font-bold px-2 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 rounded-full border border-purple-500/20 uppercase tracking-widest">
                        Stealth AI
                    </span>
                </h1>
                <p className="text-text-muted mt-1 max-w-xl">
                    Generate high-perplexity, natural-sounding assignment drafts designed to bypass standard AI detection patterns.
                </p>
            </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-surface border border-border/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                {/* Background glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-all duration-700" />

                <div className="space-y-6 relative z-10">
                   
                   {/* Custom Dropdown */}
                   <div className="relative" ref={dropdownRef}>
                      <label className="block text-xs font-bold text-text-secondary uppercase mb-2 tracking-wider">Assignment Type</label>
                      <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full flex items-center justify-between bg-surfaceHighlight border rounded-xl p-4 text-text-primary transition-all duration-200
                            ${isDropdownOpen ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-border/10 hover:border-border/20'}`}
                      >
                         <div className="flex items-center gap-3">
                            <selectedOption.icon className="w-5 h-5 text-purple-400" />
                            <span className="font-medium">{selectedOption.label}</span>
                         </div>
                         <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isDropdownOpen && (
                            <MotionDiv 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                            >
                                <div className="p-1 space-y-1">
                                    {assignmentOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => { setAssignmentType(opt.id); setIsDropdownOpen(false); }}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all
                                                ${assignmentType === opt.id 
                                                    ? 'bg-purple-600 text-white shadow-glow' 
                                                    : 'text-text-secondary hover:bg-surfaceHighlight hover:text-text-primary'}`}
                                        >
                                            <opt.icon className={`w-4 h-4 ${assignmentType === opt.id ? 'text-white' : 'text-text-muted'}`} />
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </MotionDiv>
                        )}
                      </AnimatePresence>
                   </div>

                   {/* Tone Selector */}
                   <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase mb-2 tracking-wider">Voice & Tone</label>
                      <div className="bg-surfaceHighlight p-1 rounded-xl border border-border/10 flex">
                         {['Simple', 'Academic', 'Creative'].map((t) => (
                            <button
                               key={t}
                               onClick={() => setTone(t as any)}
                               className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300
                                  ${tone === t 
                                    ? 'bg-surface text-text-primary shadow-sm border border-border/10' 
                                    : 'text-text-muted hover:text-text-secondary'}`}
                            >
                               {t}
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Prompt Input */}
                   <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase mb-2 tracking-wider">Topic & Requirements</label>
                      <div className="relative">
                        <textarea 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={`Describe your ${assignmentType.toLowerCase()} topic...\nInclude specific requirements like word count or key points.`}
                            className="w-full bg-surfaceHighlight border border-border/10 rounded-xl p-4 text-text-primary text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 h-40 resize-none placeholder-text-muted/30 transition-all"
                        />
                        <div className="absolute bottom-3 right-3 pointer-events-none">
                            <Sparkles className={`w-4 h-4 ${topic ? 'text-purple-500' : 'text-text-muted/20'}`} />
                        </div>
                      </div>
                   </div>

                   <button 
                      onClick={handleGenerate}
                      disabled={isLoading || !topic}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-glow-accent transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                   >
                      {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" /> 
                            <span className="animate-pulse">Crafting Draft...</span>
                          </>
                      ) : (
                          <>
                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Generate Human-Like Draft
                          </>
                      )}
                   </button>
                </div>
             </div>
             
             {/* Info Card */}
             <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-5 flex gap-4 items-start">
                <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                    <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h4 className="text-blue-400 font-bold text-sm mb-1">Anti-Detection Tips</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                       This tool maximizes "burstiness" and varies sentence structure. Always review and add personal classroom references for best results.
                    </p>
                </div>
             </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-8">
             <div className="bg-surface border border-border/10 rounded-2xl min-h-[600px] flex flex-col shadow-2xl relative overflow-hidden">
                {result ? (
                   <MotionDiv 
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="flex-1 flex flex-col h-full"
                   >
                      <div className="p-4 border-b border-border/10 bg-surfaceHighlight/50 flex justify-between items-center backdrop-blur-sm sticky top-0 z-20">
                         <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                <Check className="w-4 h-4 text-green-500" />
                            </div>
                            <h2 className="font-bold text-text-primary truncate text-sm md:text-base">{result.title}</h2>
                         </div>
                         <button 
                            onClick={copyToClipboard}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2
                                ${copied 
                                    ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                                    : 'bg-surfaceHighlight text-text-muted hover:text-text-primary hover:bg-surface border border-transparent'}`}
                         >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied ? 'Copied' : 'Copy Text'}
                         </button>
                      </div>
                      
                      <div className="relative flex-1 bg-surface">
                          {/* Paper texture overlay removed/simplified for clean light/dark support */}
                          
                          <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar h-full absolute inset-0">
                             <div className="max-w-3xl mx-auto">
                                <h1 className="text-2xl md:text-3xl font-serif font-bold text-text-primary mb-8 pb-4 border-b border-border/10">
                                    {result.title}
                                </h1>
                                <div className="prose prose-invert prose-lg max-w-none">
                                    <div className="font-serif text-text-secondary leading-relaxed whitespace-pre-wrap text-lg">
                                        {result.content}
                                    </div>
                                </div>
                             </div>
                          </div>
                      </div>
                   </MotionDiv>
                ) : (
                   <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                         <FileText className="w-12 h-12 text-text-muted/20" />
                      </div>
                      <h3 className="text-2xl font-bold text-text-primary mb-2">Workspace Ready</h3>
                      <p className="text-text-muted max-w-sm leading-relaxed">
                         Configure your assignment parameters on the left to generate a drafted document here.
                      </p>
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};
