import React, { useState, useEffect } from 'react';
import { Gamepad2, Layers, Trophy, Play } from 'lucide-react';
import useTitle from '../hooks/useTitle';

function LandingPage({ onEnter }) {
  useTitle('Inicio');

  const [stats, setStats] = useState({
    totalGames: 0,
    totalPlatforms: 0,
    completedGames: 0,
  });
  const [featuredCover, setFeaturedCover] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [gamesRes, platformsRes] = await Promise.all([
          fetch('http://localhost:5000/api/games'),
          fetch('http://localhost:5000/api/platforms')
        ]);

        if (gamesRes.ok && platformsRes.ok) {
          const gamesData = await gamesRes.json();
          const platformsData = await platformsRes.json();

          setStats({
            totalGames: gamesData.length,
            totalPlatforms: platformsData.length,
            completedGames: gamesData.filter(g => g.status === 'Completado').length,
          });

            const gamesWithCover = gamesData.filter(g => g.cover_path);
            
            if (gamesWithCover.length > 0) {
              // 2. Elegimos un índice al azar entre los juegos válidos
              const randomIndex = Math.floor(Math.random() * gamesWithCover.length);
              const randomGame = gamesWithCover[randomIndex];
            
              setFeaturedCover({
                title: randomGame.title,
                url: `http://localhost:5000${randomGame.cover_path}`
            });
          }
        }
      } catch (err) {
        console.error('Error al cargar estadísticas en la Landing Page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-[85vh] flex flex-col justify-between items-center px-4 py-8">
      <div />

      <div className="hero max-w-5xl mx-auto flex-1 flex items-center justify-center">
        <div className={`hero-content text-center flex flex-col gap-8 w-full ${featuredCover ? 'lg:flex-row lg:text-left lg:justify-between' : 'max-w-2xl'}`}>

          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-pressStart text-accent uppercase tracking-wide leading-none">
                BACKLOG
              </h1>
              <p className="text-xl sm:text-2xl font-bold font-sans tracking-wide text-accent">
                Aplicación de listas de videojuegos.
              </p>
            </div>

            <p className="text-base sm:text-lg opacity-80 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Para aquellos con listas enormes que nunca juegan. Registra tus videojuegos pendientes y completados, organiza tus plataformas y géneros.
            </p>

            <div className="w-full">
              {loading ? (
                <div className="flex justify-center lg:justify-start items-center py-4">
                  <span className="loading loading-dots loading-md text-primary" />
                </div>
              ) : (
                <div className="stats stats-vertical sm:stats-horizontal shadow bg-base-200 border-2 border-base-300 w-full rounded-box">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <Gamepad2 className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-xs font-bold uppercase">Videojuegos</div>
                    <div className="stat-value text-primary-content">{stats.totalGames}</div>
                    <div className="stat-desc">En lista</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <Layers className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-xs font-bold uppercase">Plataformas</div>
                    <div className="stat-value text-primary-content">{stats.totalPlatforms}</div>
                    <div className="stat-desc">Consolas</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-success">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-xs font-bold uppercase">Completados</div>
                    <div className="stat-value text-primary-content">{stats.completedGames}</div>
                    <div className="stat-desc">Finalizados</div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 text-center lg:text-center">
              <button
                onClick={onEnter}
                className="btn btn-secondary btn-lg gap-2 text-md font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="fill-current w-5 h-5" />
                Empezar
              </button>
            </div>
          </div>

          {featuredCover && (
            <div className="flex-1 flex justify-center items-center lg:justify-end animate-fade-in">
              <div className="card bg-base-200 border-2 border-base-300 shadow-xl overflow-hidden max-w-xs rotate-2 hover:rotate-0 transition-transform duration-300">
                <figure className="aspect-[3/4] w-64 bg-base-300 relative">
                  <img
                    src={featuredCover.url}
                    alt={featuredCover.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-xs font-mono text-center">
                    {featuredCover.title}
                  </div>
                </figure>
              </div>
            </div>
          )}

        </div>
      </div>

      <footer className="w-full text-center mt-12 pt-4 border-t-2 border-base-300/40 text-xs font-bold opacity-60">
        <p className="uppercase tracking-wider">Desarrollado por Hector Villegas</p>
        <p className="opacity-80">Universidad Valle del Momboy</p>
        <p className="opacity-80">Tutor Anggelo Huz</p>
      </footer>
    </div>
  );
}

export default LandingPage;
