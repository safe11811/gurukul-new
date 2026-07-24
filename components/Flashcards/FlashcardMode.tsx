
import React, { useState, useEffect } from 'react';
import { SubjectType, Flashcard } from '../../types';
import { generateFlashcards } from '../../services/aiService';
import { storageService } from '../../services/storageService';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, X, Bookmark, Plus, Layers } from 'lucide-react';

const MotionDiv = motion.div as any;

interface Props {
  subject: SubjectType;
}

export const FlashcardMode: React.FC<Props> = ({ subject }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  // Load saved cards on mount
  useEffect(() => {
    const saved = storageService.getFlashcards().filter(c => c.subject === subject);
    if (saved.length > 0) {
      setCards(saved);
    }
  }, [subject]);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    const newCards = await generateFlashcards(subject, topic);
    const updated = [...cards, ...newCards];
    setCards(updated);
    storageService.saveFlashcards(updated);
    setIsLoading(false);
    setTopic('');
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    // Left = Review Again (keep false), Right = Mastered (true)
    const currentCard = cards[currentIndex];
    const updatedCards = [...cards];
    updatedCards[currentIndex] = { ...currentCard, mastered: direction === 'right' };
    
    storageService.saveFlashcards(updatedCards);
    setCards(updatedCards);

    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      } else {
        alert("Session Complete! Starting over.");
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    }, 200);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-140px)] flex flex-col py-4">
       
       {/* Generator Header */}
       <div className="mb-6 flex gap-2">
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={`Generate ${subject} cards...`}
            className="flex-1 bg-surface border border-border/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-purple-500/50"
          />
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !topic}
            className="bg-text-primary text-background px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center min-w-[50px]"
          >
             {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" />}
          </button>
       </div>

       {/* Card Area */}
       <div className="flex-1 relative perspective-1000 flex items-center justify-center">
          {cards.length > 0 ? (
            <div className="w-full h-96 relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
               <MotionDiv 
                 className="w-full h-full absolute inset-0 preserve-3d transition-all duration-500"
                 animate={{ rotateY: isFlipped ? 180 : 0 }}
               >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-surface border-2 border-border/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl">
                     <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Concept</span>
                     <h3 className="text-2xl md:text-3xl font-bold text-center text-text-primary leading-tight">{currentCard.front}</h3>
                     <p className="absolute bottom-6 text-purple-500 text-xs font-bold uppercase tracking-wider animate-pulse">Tap to Reveal</p>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden bg-surfaceHighlight border-2 border-border/10 text-text-primary rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl rotate-y-180">
                     <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Explanation</span>
                     <p className="text-lg md:text-xl text-center font-medium leading-relaxed">{currentCard.back}</p>
                  </div>
               </MotionDiv>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/10 rounded-3xl h-80 w-full bg-surface/[0.02]">
                <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mb-6 animate-pulse">
                   <Layers className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">No Flashcards Yet</h3>
                <p className="text-text-muted text-sm max-w-xs mx-auto">
                   Enter a topic above (e.g., "Thermodynamics" or "Market Structures") to generate an AI study deck.
                </p>
             </div>
          )}
       </div>

       {/* Controls */}
       {cards.length > 0 && (
         <div className="mt-8 flex justify-center gap-8 items-center">
            <button 
              onClick={() => handleSwipe('left')}
              className="w-14 h-14 rounded-full bg-surface border border-border/10 text-red-500 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/50 transition-all active:scale-95"
            >
               <X className="w-6 h-6" />
            </button>
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest bg-surface px-3 py-1 rounded-full border border-border/10">
               {currentIndex + 1} / {cards.length}
            </span>
            <button 
              onClick={() => handleSwipe('right')}
              className="w-14 h-14 rounded-full bg-surface border border-border/10 text-green-500 flex items-center justify-center hover:bg-green-500/10 hover:border-green-500/50 transition-all active:scale-95"
            >
               <Check className="w-6 h-6" />
            </button>
         </div>
       )}
    </div>
  );
};
