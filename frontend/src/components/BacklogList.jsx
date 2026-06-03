import React from 'react';

function BacklogList() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-accent uppercase">Mi Backlog</h2>
        <p className="text-base-content opacity-70">Juegos pendientes y completados</p>
      </div>

      <div className="card bg-base-200 border-2 border-base-300 rounded-box p-8">
        <h3 className="text-xl font-bold mb-4">Lista de videojuegos</h3>
        <p className="text-sm opacity-80 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
  );
}

export default BacklogList;
