import React from 'react';
import { LayoutDashboard, Gamepad2, Layers } from 'lucide-react';

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-base-200 p-6 flex flex-col justify-between border-r-2 border-base-300 h-full">
      <div className="flex flex-col gap-6">
        <div className="text-center py-4 border-b-2 border-base-300">
          <h1 className="text-2xl font-pressStart uppercase tracking-wider text-accent">
            BACKLOG
          </h1>
        </div>

        <ul className="menu menu-vertical p-0 gap-3">
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 font-bold py-3 px-4 ${activeTab === 'dashboard' ? 'active' : 'hover:bg-base-300'
                }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-3 font-bold py-3 px-4 ${activeTab === 'games' ? 'active' : 'hover:bg-base-300'
                }`}
            >
              <Gamepad2 size={20} />
              Mi Backlog
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('platforms')}
              className={`flex items-center gap-3 font-bold py-3 px-4 ${activeTab === 'platforms' ? 'active' : 'hover:bg-base-300'
                }`}
            >
              <Layers size={20} />
              Plataformas
            </button>
          </li>
        </ul>
      </div>

      <div className="border-t-2 border-base-300 pt-4 text-center">
        <p className="text-sm font-black opacity-85">Hector Villegas</p>
      </div>
    </div>
  );
}

export default Sidebar;
