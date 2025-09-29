import React from 'react';

const AnalysisProgress = () => {
  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 text-center">
      <h2 className="text-2xl font-semibold mb-6">Generating Comprehensive Solution Analysis</h2>
      <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
        <div className="progress-bar" style={{ width: '30%' }}>
          <div className="progress-fill" style={{ width: '30%' }}></div>
        </div>
      </div>
      <p className="text-gray-400">Please wait while we analyze your market opportunities...</p>
    </div>
  );
};

export default AnalysisProgress;