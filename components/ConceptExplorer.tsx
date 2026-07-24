import React, { useState } from 'react';
import { MOCK_CONCEPT_NODES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Check, Search } from 'lucide-react';

export const ConceptExplorer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  // Simple SVG line drawer
  const renderConnections = () => {
    return MOCK_CONCEPT_NODES.flatMap(node => 
      node.connections.map((targetId: any) => {
        const target = MOCK_CONCEPT_NODES.find(n => n.id === targetId);
        if (!target) return null;
        return (
          <g key={`${node.id}-${target.id}`}>
             <path 
                d={`M${node.x + 60} ${node.y + 40} C ${node.x + 60} ${node.y + 100}, ${target.x + 60} ${target.y - 50}, ${target.x + 60} ${target.y + 40}`}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
             />
             <circle cx={target.x + 60} cy={target.y + 40} r="3" fill="#94a3b8" />
          </g>
        );
      })
    );
  };

  return (
    <div className="w-full h-[700px] bg-white rounded-xl shadow-paper border-2 border-gray-200 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-dot-paper opacity-50"></div>
      
      {/* Search Bar */}
      <div className="absolute top-6 left-6 z-20 w-64">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search concepts..." 
              className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur border border-gray-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
            />
         </div>
      </div>

      <div className="absolute inset-0 p-10 overflow-auto cursor-grab active:cursor-grabbing">
        <div className="relative w-[1000px] h-[800px]" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {renderConnections()}
          </svg>

          {MOCK_CONCEPT_NODES.map(node => (
            <Node 
              key={node.id} 
              node={node} 
              isSelected={selectedNode === node.id}
              onClick={() => setSelectedNode(node.id)} 
            />
          ))}
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex gap-2">
         <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="w-10 h-10 bg-white rounded-lg shadow border border-gray-200 font-bold text-gray-600">-</button>
         <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="w-10 h-10 bg-white rounded-lg shadow border border-gray-200 font-bold text-gray-600">+</button>
      </div>

      {/* Details Slide-over */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute top-0 right-0 bottom-0 w-96 bg-[#fdfbf7] border-l-2 border-gray-200 p-6 z-30 shadow-2xl overflow-y-auto"
          >
            {(() => {
                const node = MOCK_CONCEPT_NODES.find(n => n.id === selectedNode);
                if (!node) return null;
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${node.status === 'mastered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                {node.status}
                            </span>
                            <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>
                        
                        <h2 className="text-3xl font-marker font-bold text-gray-800 leading-none">{node.label}</h2>
                        
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm -rotate-1">
                           <p className="font-hand text-xl text-gray-700 leading-normal">
                             Fundamental concept required for {node.connections.length} advanced topics.
                           </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-bold text-sm text-gray-400 uppercase">Related Topics</h4>
                            <div className="flex flex-wrap gap-2">
                               {node.connections.map((cId: any) => {
                                   const c = MOCK_CONCEPT_NODES.find(n => n.id === cId);
                                   return c ? <span key={c.id} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{c.label}</span> : null
                               })}
                            </div>
                        </div>

                        <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 transition">
                            Open Study Notes
                        </button>
                    </div>
                )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Node = ({ node, isSelected, onClick }: any) => {
  const getStyles = () => {
    switch(node.status) {
      case 'mastered': return 'bg-green-50 border-green-500 text-green-900';
      case 'unlocked': return 'bg-white border-gray-800 text-gray-900';
      default: return 'bg-gray-50 border-gray-300 text-gray-400 opacity-80';
    }
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      style={{ left: node.x, top: node.y }}
      className={`absolute w-32 h-20 rounded-lg border-2 cursor-pointer flex flex-col items-center justify-center p-2 text-center shadow-sm transition-all z-10
        ${getStyles()} 
        ${isSelected ? 'ring-4 ring-yellow-200 shadow-xl scale-110 z-20' : ''}
      `}
    >
      <span className="font-hand font-bold text-lg leading-none mb-1">{node.label}</span>
      <div className="mt-1">
         {node.status === 'mastered' && <Check className="w-4 h-4 text-green-600" />}
         {node.status === 'locked' && <Lock className="w-3 h-3 text-gray-400" />}
      </div>
    </motion.div>
  );
};
