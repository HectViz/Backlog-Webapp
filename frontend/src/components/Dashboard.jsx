import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

function Dashboard() {
  const [games, setGames] = useState([]);
  const [platformsCount, setPlatformsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeGameId, setActiveGameId] = useState(() => {
    return localStorage.getItem('dashboard_active_game_id') || '';
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [gamesRes, platformsRes] = await Promise.all([
          fetch('http://localhost:5000/api/games'),
          fetch('http://localhost:5000/api/platforms')
        ]);
        setGames(await gamesRes.json());
        setPlatformsCount((await platformsRes.json()).length);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalGames = games.length;
  const playing = games.filter((g) => g.status === 'Jugando').length;
  const pending = games.filter((g) => g.status === 'En cola').length;
  const completed = games.filter((g) => g.status === 'Completado').length;

  const averagePriority = totalGames > 0
    ? (games.reduce((acc, g) => acc + g.priority, 0) / totalGames).toFixed(1)
    : '0.0';

  const platformCounts = {};
  games.forEach((game) => {
    if (game.platform_name) {
      platformCounts[game.platform_name] = (platformCounts[game.platform_name] || 0) + 1;
    }
  });

  let topPlatform = 'Ninguna';
  let topPlatformCount = 0;
  Object.entries(platformCounts).forEach(([platform, count]) => {
    if (count > topPlatformCount) {
      topPlatformCount = count;
      topPlatform = platform;
    }
  });

  const activeGame = games.find((g) => g.id.toString() === activeGameId);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-24">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-black text-accent uppercase">Dashboard</h2>
        <p className="text-sm opacity-70">Estadísticas del Backlog</p>
      </div>

      <div className="stats stats-vertical sm:stats-horizontal w-full bg-base-200 border-2 border-base-300 rounded-box shadow-sm">
        <div className="stat">
          <div className="stat-title font-bold text-xs uppercase">Total de Juegos</div>
          <div className="stat-value text-primary-content">{totalGames}</div>
          <div className="stat-desc mt-1">Registrados</div>
        </div>

        <div className="stat">
          <div className="stat-title font-bold text-xs uppercase">Jugando Actualmente</div>
          <div className="stat-value text-primary-content">{playing}</div>
          <div className="stat-desc mt-1">En curso</div>
        </div>

        <div className="stat">
          <div className="stat-title font-bold text-xs uppercase">Prioridad Promedio</div>
          <div className="stat-value text-primary-content flex items-center gap-1.5">
            <span>{averagePriority}</span>
            <Star className="fill-primary-content text-primary-content w-6 h-6" />
          </div>
          <div className="stat-desc mt-1">Clasificación media</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-200 border-2 border-base-300 p-6 rounded-box shadow-sm">
          <h3 className="text-xs font-black uppercase mb-4 opacity-80 tracking-wider">ESTADÍSTICAS</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Completados ({completed})</span>
                <span>{totalGames > 0 ? Math.round((completed / totalGames) * 100) : 0}%</span>
              </div>
              <progress className="progress progress-success w-full" value={completed} max={totalGames || 100}></progress>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Jugando ({playing})</span>
                <span>{totalGames > 0 ? Math.round((playing / totalGames) * 100) : 0}%</span>
              </div>
              <progress className="progress progress-primary w-full" value={playing} max={totalGames || 100}></progress>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>En Cola ({pending})</span>
                <span>{totalGames > 0 ? Math.round((pending / totalGames) * 100) : 0}%</span>
              </div>
              <progress className="progress progress-secondary w-full" value={pending} max={totalGames || 100}></progress>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 border-2 border-base-300 p-6 rounded-box shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-black uppercase mb-3 opacity-80 tracking-wider">Resumen Actual</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-base-300 pb-2">
                <span className="opacity-70">Plataformas Registradas:</span>
                <span className="font-bold">{platformsCount}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="opacity-70">Plataforma con más juegos:</span>
                <span className="font-bold">
                  {topPlatform} {topPlatformCount > 0 && `(${topPlatformCount})`}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-base-300">
            <span className="text-xs font-bold uppercase opacity-70 block mb-2">Juego Activo Favorito</span>
            <select
              className="select select-bordered select-sm w-full bg-base-100 font-sans"
              value={activeGameId}
              onChange={(e) => {
                setActiveGameId(e.target.value);
                localStorage.setItem('dashboard_active_game_id', e.target.value);
              }}
            >
              <option value="">Seleccionar videojuego</option>
              {games.map((g) => (
                <option key={g.id} value={g.id.toString()}>
                  {g.title}
                </option>
              ))}
            </select>

            {activeGame && (
              <div className="mt-3 p-3 bg-base-300 rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="truncate max-w-[180px]">{activeGame.title}</span>
                <span className="uppercase">{activeGame.status}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
