
import React from 'react';

interface AnalysisResultProps {
  result: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-inner">
      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed font-mono text-sm">
        {result}
      </p>
    </div>
  );
};
