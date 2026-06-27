import React, { useState, useEffect } from 'react';
import { Shuffle, Gamepad2, Star, Layers, RefreshCw } from 'lucide-react';
import useRandomGame from '../hooks/useRandomGame';
import useTitle from '../hooks/useTitle';

function Randomizer() {
  useTitle('Ruleta');

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/games');
        if (response.ok) {
          const data = await response.json();
          setGames(data);
        }
      } catch (err) {
        console.error('Error al cargar juegos en la ruleta:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const { selectedGame, isSpinning, spin } = useRandomGame(games);

  const eligibleCount = games.filter(g => {
    if (statusFilter) return g.status === statusFilter;
    return g.status !== 'Completado';
  }).length;

  const handleSpinClick = () => {
    spin(statusFilter);
  };

  const coverUrl = selectedGame?.cover_path
    ? `http://localhost:5000${selectedGame.cover_path}`
    : null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h2 className="text-4xl font-black text-accent uppercase">Ruleta</h2>
        <p className="text-base-content opacity-70">Para los indecisos. Gira a ver que sale hoy</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : games.length === 0 ? (
        <div className="card bg-base-200 border-2 border-base-300 p-8 text-center rounded-box">
          <Gamepad2 className="w-12 h-12 mx-auto opacity-40 mb-3 text-base-content" />
          <h3 className="font-bold text-lg">Catálogo Vacío</h3>
          <p className="text-sm opacity-70 mt-1">Registra videojuegos primero antes de poder girar la ruleta.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="card bg-base-200 border-2 border-base-300 p-4 rounded-box flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="font-bold text-sm">Filtro de ruleta</span>
              <span className="text-xs opacity-75">{eligibleCount} Juegos elegibles en la ruleta</span>
            </div>

            <select
              className="select select-bordered select-sm w-full sm:w-auto font-sans bg-base-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={isSpinning}
            >
              <option value="">Cualquier No completado</option>
              <option value="En cola">Solo En Cola</option>
              <option value="Jugando">Solo Jugando</option>
            </select>
          </div>

          <div className="card bg-base-200 border-2 border-base-300 rounded-box overflow-hidden shadow-md">
            <div className="bg-neutral text-neutral-content p-6 flex flex-col items-center justify-center min-h-[220px] text-center border-b-2 border-base-300 relative">
              {isSpinning ? (
                <div className="space-y-4">
                  <RefreshCw className="w-10 h-10 mx-auto text-primary animate-spin" />
                  <p className="font-pressStart text-xs tracking-wider text-primary animate-pulse">
                    AGARRANDO UNO...
                  </p>
                  <p className="font-bold text-lg text-primary truncate max-w-sm">
                    {selectedGame?.title || '???'}
                  </p>
                </div>
              ) : selectedGame ? (
                <div className="flex flex-col md:flex-row gap-6 items-center w-full max-w-md animate-fade-in">
                  {/* Portada */}
                  <div className="w-28 h-36 bg-base-300 rounded-md overflow-hidden border border-neutral-content/20 flex-shrink-0 flex items-center justify-center shadow-md">
                    {coverUrl ? (
                      <img src={coverUrl} alt={selectedGame.title} className="w-full h-full object-cover" />
                    ) : (
                      <Gamepad2 className="w-8 h-8 opacity-30 text-neutral-content" />
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-2 w-full min-w-0">
                    <span className="badge badge-accent badge-sm uppercase font-bold tracking-wider">
                      {selectedGame.status}
                    </span>
                    <h3 className="font-bold text-xl md:text-2xl text-neutral-content truncate">
                      {selectedGame.title}
                    </h3>
                    <div className="flex flex-col gap-1 text-sm opacity-90">
                      {selectedGame.platform_name && (
                        <div className="flex items-center gap-1.5 justify-center md:justify-start">
                          <Layers className="w-4 h-4 text-primary" />
                          <span className="truncate">{selectedGame.platform_name}</span>
                        </div>
                      )}
                      {selectedGame.genre_name && (
                        <div className="flex items-center gap-1.5 justify-center md:justify-start">
                          <span className="font-semibold text-xs opacity-70">Género:</span>
                          <span className="truncate">{selectedGame.genre_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 justify-center md:justify-start pt-1">
                        <span className="font-semibold text-xs opacity-70 mr-1">Prioridad:</span>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={`${i < selectedGame.priority
                              ? 'text-warning fill-warning'
                              : 'text-neutral-content/20'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Gamepad2 className="w-12 h-12 mx-auto opacity-30 text-neutral-content" />
                  <p className="font-pressStart text-xs tracking-wider opacity-60">
                    READY
                  </p>
                  <p className="text-sm opacity-70 max-w-xs mx-auto">
                    Dale a Girar para decidir.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 bg-base-300 flex justify-center">
              {eligibleCount === 0 ? (
                <div className="alert alert-warning text-sm">
                  <span>No hay juegos disponibles con este filtro.</span>
                </div>
              ) : (
                <button
                  onClick={handleSpinClick}
                  disabled={isSpinning}
                  className="btn btn-secondary btn-lg w-full sm:w-auto gap-2 uppercase font-bold tracking-wider hover:scale-105 active:scale-95 transition-all shadow-sm"
                >
                  <Shuffle className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                  Girar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Randomizer;
