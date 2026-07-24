import React from 'react';
import { SubjectType } from '../../types';
import { FlaskConical, Move, Sliders } from 'lucide-react';

export const LabSandbox: React.FC<{ subject: SubjectType }> = ({ subject }) => {
  return (
    <div className="max-w-5xl mx-auto text-center py-20">
      <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-indigo-100">
         <FlaskConical className="w-16 h-16 text-indigo-500" />
      </div>
      <h2 className="text-4xl font-marker font-bold text-gray-800 mb-4">Interactive Lab</h2>
      <p className="text-xl text-gray-500 font-hand max-w-xl mx-auto mb-8">
        We are building a virtual {subject} laboratory where you can manipulate variables, build molecules, and run simulations offline.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
         <FeatureCard icon={Move} title="Physics Engine" desc="Simulate forces and motion" />
         <FeatureCard icon={FlaskConical} title="Chemistry Mixer" desc="React virtual chemicals" />
         <FeatureCard icon={Sliders} title="Variable Control" desc="See real-time effects" />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="p-6 bg-white rounded-xl shadow-paper border border-gray-100">
     <Icon className="w-8 h-8 text-gray-800 mb-4 mx-auto" />
     <h3 className="font-bold font-display text-lg mb-2">{title}</h3>
     <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);
