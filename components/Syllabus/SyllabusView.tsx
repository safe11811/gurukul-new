
import React from 'react';
import { SubjectType, ClassLevel, ViewState } from '../../types';
import { SYLLABUS_DATA } from '../../constants';
import { storageService } from '../../services/storageService';
import { CheckCircle, Circle, Book, ChevronRight, Play } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  subject: SubjectType;
  onChangeView: (view: ViewState) => void;
}

export const SyllabusView: React.FC<Props> = ({ subject, onChangeView }) => {
  const { user } = useAuth();
  const classLevel = user?.classLevel || 'Grade 11';
  const chapters = SYLLABUS_DATA[subject][classLevel] || [];
  const masteredChapters = storageService.getMasteredChapters();

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Logic & Curriculum</h1>
        <p className="text-text-muted">Structured NCERT path for {classLevel} {subject}. Select any chapter to start.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border/10 overflow-hidden">
        {chapters.length > 0 ? (
          <div className="divide-y divide-border/5">
            {chapters.map((chapter, idx) => {
              const isMastered = masteredChapters.includes(chapter.id);
              
              return (
                <div 
                  key={chapter.id} 
                  className="p-6 hover:bg-surfaceHighlight transition-colors group cursor-pointer"
                  onClick={() => onChangeView(ViewState.QUIZ)} // Or specific chapter view logic
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 
                       ${isMastered ? 'bg-green-500 border-green-500 text-white' : 'border-border/20 text-transparent group-hover:border-border/40'}`}>
                       {isMastered ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4 fill-border/10" />}
                    </div>
                    
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                          <h3 className={`text-lg font-bold ${isMastered ? 'text-green-500' : 'text-text-primary'}`}>
                            {idx + 1}. {chapter.title}
                          </h3>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-text-primary text-background text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                             Start <Play className="w-3 h-3 fill-current" />
                          </span>
                       </div>
                       <p className="text-sm text-text-muted mb-2">{chapter.description}</p>
                       <div className="flex flex-wrap gap-2">
                          {chapter.topics.map(t => (
                             <span key={t} className="text-xs px-2 py-1 bg-surfaceHighlight rounded text-text-secondary border border-border/5">
                                {t}
                             </span>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center text-text-muted">
             <Book className="w-12 h-12 mx-auto mb-4 opacity-20" />
             <p>No syllabus data available for {classLevel} {subject} yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
