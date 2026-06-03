import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BacklogList from './components/BacklogList';
import PlatformList from './components/PlatformList';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'games':
        return <BacklogList />;
      case 'platforms':
        return <PlatformList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row h-screen bg-base-100 text-base-content overflow-hidden font-sans"
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
