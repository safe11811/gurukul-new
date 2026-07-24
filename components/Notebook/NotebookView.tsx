import React, { useState, useEffect, useRef } from 'react';
import { SubjectType } from '../../types';
import { SUBJECT_DETAILS } from '../../constants';
import { storageService } from '../../services/storageService';
import { Save, Plus, Trash2, Pen, ChevronLeft, Eye, Edit, Sigma } from 'lucide-react';

// Math Renderer Component using KaTeX
const MathRenderer = ({ content }: { content: string }) => {
  // Normalization: Convert \( ... \) to $ ... $ and \[ ... \] to $$ ... $$
  const normalizedContent = content
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');

  const renderContent = () => {
    // Split by latex delimiters $...$ or $$...$$
    const parts = normalizedContent.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Block math
        const math = part.slice(2, -2);
        try {
          const html = (window as any).katex ? (window as any).katex.renderToString(math, { displayMode: true }) : math;
          return <div key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-4 text-center overflow-x-auto text-lg text-text-primary" />;
        } catch (e) {
          return <span key={index} className="text-red-400 text-xs font-mono">{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline math
        const math = part.slice(1, -1);
        try {
           const html = (window as any).katex ? (window as any).katex.renderToString(math, { displayMode: false }) : math;
           return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="text-text-primary" />;
        } catch (e) {
           return <span key={index} className="text-red-400 text-xs font-mono">{part}</span>;
        }
      } else {
        // Text - preserve newlines
        return <span key={index} className="text-text-primary">{part}</span>;
      }
    });
  };

  return <div className="whitespace-pre-wrap font-hand text-xl leading-8 text-text-primary">{renderContent()}</div>;
};

export const NotebookView: React.FC<{ subject: SubjectType }> = ({ subject }) => {
  const [notes, setNotes] = useState(storageService.getNotes().filter(n => n.subject === subject));
  const [activeNote, setActiveNote] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const config = SUBJECT_DETAILS[subject];

  // Handle Subject Switching
  useEffect(() => {
    // 1. Refresh list for new subject
    setNotes(storageService.getNotes().filter(n => n.subject === subject));
    
    // 2. Check if active note belongs to previous subject
    setActiveNote((prev: any) => {
      if (prev && prev.subject !== subject) {
        return null;
      }
      return prev;
    });
    
    // 3. Always reset edit mode on subject switch for clean slate
    setEditMode(false);
  }, [subject]);

  const createNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      subject: subject,
      date: Date.now(),
      tags: []
    };
    storageService.addNote(newNote);
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditMode(true);
  };

  const updateNote = (field: string, value: string) => {
    if (!activeNote) return;
    const updated = { ...activeNote, [field]: value };
    setActiveNote(updated);
    // Optimistic update
    const updatedList = notes.map(n => n.id === updated.id ? updated : n);
    setNotes(updatedList);
    // Persist
    storageService.save('lumina_notes', storageService.getNotes().map(n => n.id === updated.id ? updated : n));
  };

  const insertAtCursor = (text: string, cursorOffset: number = 0) => {
    if (!activeNote || !textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = activeNote.content || '';
    
    const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
    updateNote('content', newContent);
    
    setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            const newCursor = start + text.length + cursorOffset;
            textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
    }, 0);
  };

  const latexTools = [
    { label: '$', value: '$$', offset: -1 },
    { label: '$$', value: '$$\n\n$$', offset: -3 },
    { label: 'frac', value: '\\frac{}{}', offset: -3 },
    { label: 'sqrt', value: '\\sqrt{}', offset: -1 },
    { label: 'sup', value: '^{}', offset: -1 },
    { label: 'sub', value: '_{}', offset: -1 },
    { label: '∫', value: '\\int_{}^{} ', offset: -4 },
    { label: '∑', value: '\\sum_{}^{} ', offset: -4 },
    { label: 'α', value: '\\alpha ' },
    { label: 'β', value: '\\beta ' },
    { label: 'θ', value: '\\theta ' },
    { label: 'π', value: '\\pi ' },
    { label: '∞', value: '\\infty ' },
    { label: '→', value: '\\rightarrow ' },
    { label: '≈', value: '\\approx ' },
    { label: '≠', value: '\\neq ' },
    { label: '≤', value: '\\leq ' },
    { label: '≥', value: '\\geq ' },
    { label: '·', value: '\\cdot ' },
    { label: '×', value: '\\times ' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6">
      {/* Note List */}
      <div className={`w-full md:w-1/3 flex flex-col gap-4 ${activeNote ? 'hidden md:flex' : 'flex'}`}>
        <button 
          onClick={createNote}
          className="w-full py-3 bg-surfaceHighlight border border-border/10 rounded-xl font-semibold text-text-primary hover:bg-surface transition flex items-center justify-center gap-2"
        >
           <Plus className="w-5 h-5" /> New {subject} Note
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
           {notes.map(note => {
             // Robust regex to detect math content (avoiding simple currency symbols)
             const hasMath = note.content && /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|\\\[|\\\(|\\begin\{)/.test(note.content);
             return (
               <button 
                 key={note.id}
                 onClick={() => { setActiveNote(note); setEditMode(false); }}
                 className={`w-full text-left p-4 rounded-xl border transition-all ${activeNote?.id === note.id ? 'bg-surfaceHighlight border-border/20 shadow-sm' : 'bg-transparent border-transparent hover:bg-surfaceHighlight'}`}
               >
                  <div className="flex justify-between items-start">
                    <h4 className="font-hand font-bold text-xl text-text-primary truncate flex-1">{note.title || 'Untitled'}</h4>
                    {hasMath && (
                      <span className="ml-2 px-1.5 py-0.5 bg-surfaceHighlight text-text-secondary text-[10px] rounded border border-border/10 font-mono" title="Contains Math">
                        <Sigma className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1 font-sans">{new Date(note.date).toLocaleDateString()}</p>
               </button>
             );
           })}
           {notes.length === 0 && (
             <div className="text-center p-8 text-text-muted italic">No notes found for {subject}. Create one!</div>
           )}
        </div>
      </div>

      {/* Editor/Viewer */}
      <div className={`flex-1 bg-surface border border-border/10 rounded-xl overflow-hidden flex flex-col ${!activeNote ? 'hidden md:flex' : 'flex'}`}>
         {activeNote ? (
           <>
             {/* Toolbar */}
             <div className="p-4 border-b border-border/10 flex items-center gap-3">
                <button onClick={() => setActiveNote(null)} className="md:hidden text-text-muted"><ChevronLeft className="w-6 h-6" /></button>
                <div className="flex-1">
                   <input 
                     value={activeNote.title}
                     onChange={(e) => updateNote('title', e.target.value)}
                     className="bg-transparent text-2xl font-hand font-bold text-text-primary focus:outline-none w-full placeholder-text-muted/20"
                     placeholder="Note Title..."
                   />
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setEditMode(!editMode)}
                     className={`p-2 rounded-lg transition-colors ${editMode ? 'bg-blue-500/20 text-blue-400' : 'bg-surfaceHighlight text-text-muted hover:text-text-primary'}`}
                     title={editMode ? "View Mode" : "Edit Mode"}
                   >
                     {editMode ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                   </button>
                   <button 
                     onClick={() => {
                       storageService.deleteNote(activeNote.id);
                       setNotes(prev => prev.filter(n => n.id !== activeNote.id));
                       setActiveNote(null);
                     }} 
                     className="p-2 hover:bg-red-500/20 hover:text-red-400 text-text-muted rounded-lg"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
             
             {/* Content Area */}
             <div className="flex-1 overflow-y-auto relative bg-grid-dark flex flex-col">
                {editMode ? (
                  <>
                    {/* LaTeX Toolbar */}
                    <div className="flex gap-2 p-2 overflow-x-auto border-b border-border/10 bg-surfaceHighlight scrollbar-hide items-center">
                        <span className="text-[10px] font-bold text-text-muted uppercase mr-1">Math:</span>
                       {latexTools.map((tool, i) => (
                          <button 
                            key={i}
                            onClick={() => insertAtCursor(tool.value, tool.offset)}
                            className="px-2 py-1 rounded bg-surface hover:bg-surfaceHighlight text-text-primary text-xs font-mono border border-border/10 whitespace-nowrap min-w-[24px]"
                            title={tool.label}
                          >
                            {tool.label}
                          </button>
                       ))}
                    </div>

                    <div className="flex-1 min-h-[50%] border-b border-border/10">
                      <textarea 
                        ref={textareaRef}
                        value={activeNote.content}
                        onChange={(e) => updateNote('content', e.target.value)}
                        className="w-full h-full bg-transparent resize-none p-6 focus:outline-none font-mono text-sm leading-6 text-text-primary placeholder-text-muted/30"
                        placeholder={config.notePlaceholder}
                      />
                    </div>
                    {/* Live Preview Pane */}
                    <div className="flex-1 p-6 bg-surfaceHighlight overflow-y-auto">
                        <div className="text-xs font-bold text-text-secondary uppercase mb-2">Live Preview</div>
                        <MathRenderer content={activeNote.content || "Start typing to see preview..."} />
                    </div>
                  </>
                ) : (
                  <div className="p-8 min-h-full">
                    {activeNote.content ? <MathRenderer content={activeNote.content} /> : <p className="text-text-muted italic font-hand text-lg">Empty note. Tap edit to start writing.</p>}
                  </div>
                )}
             </div>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-text-muted p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center mb-4">
                 <Pen className="w-8 h-8 opacity-50" />
              </div>
              <p className="font-hand text-xl">Select a note to view details</p>
              <p className="text-sm mt-2 font-mono opacity-60">Supports LaTeX: $E=mc^2$ and $$ \int dx $$</p>
           </div>
         )}
      </div>
    </div>
  );
};
