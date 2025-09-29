import React, { useState } from 'react';

const WelcomePage = ({ industries }) => {
  const [selectedSubindustries, setSelectedSubindustries] = useState([]);
  const [analysisUrl, setAnalysisUrl] = useState('');
  const [companyType, setCompanyType] = useState('VAR');

  const handleAddSubindustry = () => {
    // Implementation here
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Channel Sales Intelligence Platform</h1>
      
      {/* Company Type Selection */}
      <div className="mb-6">
        <h2 className="text-xl mb-4">Select Your Company Type:</h2>
        <div className="grid grid-cols-3 gap-4">
          {[{value: 'VAR', label: 'Value Added Reseller'}, 
           {value: 'SI', label: 'System Integrator'},
           {value: 'MSP', label: 'Managed Service Provider'},
           {value: 'MSSP', label: 'MSSP'},
           {value: 'ISV', label: 'ISV'},
           {value: 'Other', label: 'Other'}].map(type => (
            <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="companyType" 
                value={type.value}
                checked={companyType === type.value}
                onChange={(e) => setCompanyType(e.target.value)}
                className="form-radio text-blue-500"
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Industry Selection */}
      <div className="mb-6">
        <h2 className="text-xl mb-4">Select Industry and Subindustry:</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Industry:</label>
            <select className="w-full p-2 bg-gray-700 rounded">
              <option>Select an industry</option>
              {industries.map((industry, idx) => (
                <option key={idx} value={industry.industry}>{industry.industry}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Subindustry:</label>
            <select className="w-full p-2 bg-gray-700 rounded">
              <option>Select a subindustry</option>
            </select>
          </div>
          <button 
            onClick={handleAddSubindustry}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Add Subindustry
          </button>
        </div>
      </div>

      {/* URL Input */}
      <div className="mt-8">
        <label className="block mb-2">Enter Solution URL for Analysis:</label>
        <input 
          type="text" 
          placeholder="company.com/solution"
          className="w-full p-2 bg-gray-700 rounded mb-2"
          value={analysisUrl}
          onChange={(e) => setAnalysisUrl(e.target.value)}
        />
        <p className="text-sm text-gray-400 mb-4">Enter any B2B solution URL (https:// will be added automatically)</p>
        <button 
          onClick={() => {/* Start analysis */}}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold"
        >
          Research & Analyze Markets
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;