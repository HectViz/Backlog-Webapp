import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BacklogList from './components/BacklogList';
import PlatformList from './components/PlatformList';
import LandingPage from './components/LandingPage';
import Randomizer from './components/Randomizer';
import GenreList from './components/GenreList';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [activeTab, setActiveTab] = useLocalStorage('backlog_active_tab', 'landing');

  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onEnter={() => setActiveTab('dashboard')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'games':
        return <BacklogList />;
      case 'platforms':
        return <PlatformList />;
      case 'genres':
        return <GenreList />;
      case 'randomizer':
        return <Randomizer />;
      default:
        return <LandingPage onEnter={() => setActiveTab('dashboard')} />;
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row h-screen bg-base-100 text-base-content overflow-hidden font-sans"
    >
      {activeTab !== 'landing' && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <main className="flex-1 overflow-y-auto p-8 bg-base-100">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;

