import React from 'react';
import { Home, LayoutDashboard, Gamepad2, Layers, Tag, Shuffle } from 'lucide-react';

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-full md:w-64 bg-base-200 p-4 md:p-6 flex flex-row md:flex-col justify-between items-center md:items-stretch border-b-2 md:border-b-0 md:border-r-2 border-base-300 h-auto md:h-full">
      <div className="flex flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-start">
        <div className="text-center py-2 md:py-4 border-b-0 md:border-b-2 border-base-300">
          <h1 className="text-xl md:text-2xl font-pressStart uppercase tracking-wider text-accent">
            BACKLOG
          </h1>
        </div>

        <ul className="menu menu-horizontal md:menu-vertical p-0 gap-1 md:gap-3 flex-wrap md:flex-nowrap justify-center md:justify-start">
          <li>
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-2 md:gap-3 font-bold py-2 md:py-3 px-3 md:px-4 ${activeTab === 'landing' ? 'active' : 'hover:bg-base-300'
                }`}
              title="Inicio"
            >
              <Home size={18} />
              <span className="hidden sm:inline md:inline-block">Inicio</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 md:gap-3 font-bold py-2 md:py-3 px-3 md:px-4 ${activeTab === 'dashboard' ? 'active' : 'hover:bg-base-300'
                }`}
              title="Dashboard"
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline md:inline-block">Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 md:gap-3 font-bold py-2 md:py-3 px-3 md:px-4 ${activeTab === 'games' ? 'active' : 'hover:bg-base-300'
                }`}
              title="Mi Backlog"
            >
              <Gamepad2 size={18} />
              <span className="hidden sm:inline md:inline-block">Mi Backlog</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('platforms')}
              className={`flex items-center gap-2 md:gap-3 font-bold py-2 md:py-3 px-3 md:px-4 ${activeTab === 'platforms' ? 'active' : 'hover:bg-base-300'
                }`}
              title="Plataformas"
            >
              <Layers size={18} />
              <span className="hidden sm:inline md:inline-block">Plataformas</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('genres')}
              className={`flex items-center gap-2 md:gap-3 font-bold py-2 md:py-3 px-3 md:px-4 ${activeTab === 'genres' ? 'active' : 'hover:bg-base-300'
                }`}
              title="Géneros"
            >
              <Tag size={18} />
              <span className="hidden sm:inline md:inline-block">Géneros</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('randomizer')}
              className={`flex items-center gap-2 md:gap-3 font-bold py-2 md:py-3 px-3 md:px-4 ${activeTab === 'randomizer' ? 'active' : 'hover:bg-base-300'
                }`}
              title="Ruleta"
            >
              <Shuffle size={18} />
              <span className="hidden sm:inline md:inline-block">Ruleta</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="hidden md:block border-t-2 border-base-300 pt-4 text-center">
        <p className="text-sm font-black opacity-85">Hector Villegas</p>
      </div>
    </div>
  );
}

export default Sidebar;

