import React, { useState, useEffect } from 'react';
import WelcomePage from './components/WelcomePage';
import AnalysisProgress from './components/AnalysisProgress';
import Dashboard from './components/Dashboard';
import { getIndustries } from '../server/routes/analysisRoutes';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    // Fetch industries from backend
    getIndustries()
      .then(data => setIndustries(data))
      .catch(error => console.error('Error loading industries:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {currentPage === 'welcome' && <WelcomePage industries={industries} />}
      {currentPage === 'progress' && <AnalysisProgress />}
      {currentPage === 'dashboard' && <Dashboard />}
    </div>
  );
}

export default App;