import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, LayoutGrid, List, Pencil, Trash2 } from 'lucide-react';
import GameCard from './GameCard';
import GameDetailModal from './GameDetailModal';
import ConfirmModal from './ConfirmModal';
import GameModal from './GameModal';

function BacklogList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('priority_desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'

  const [selectedGame, setSelectedGame] = useState(null);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [gameForModal, setGameForModal] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchGames();
  }, [searchQuery, statusFilter, sortBy]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery.trim());
      }
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }
      if (sortBy) {
        queryParams.append('sortBy', sortBy);
      }

      const response = await fetch(`http://localhost:5000/api/games?${queryParams.toString()}`);
      const data = await response.json();
      setGames(data);
    } catch (err) {
      console.error('Error al cargar videojuegos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (game) => {
    setSelectedGame(game);
    document.getElementById('game_detail_modal').showModal();
  };

  const handleNewGameClick = () => {
    setGameForModal(null);
    document.getElementById('game_modal').showModal();
  };

  const handleEditGameClick = (game) => {
    setGameForModal(game);
    document.getElementById('game_modal').showModal();
  };

  const handleDeleteClick = (game) => {
    setDeleteError('');
    setGameToDelete(game);
    document.getElementById('confirm_delete_game').showModal();
  };

  const handleConfirmDelete = async () => {
    if (!gameToDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/games/${gameToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        setDeleteError(data.error || 'No se pudo eliminar el videojuego.');
        return;
      }
      fetchGames();
    } catch (err) {
      setDeleteError('No se pudo conectar con el servidor.');
    }
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'title':
        return 'Nombre';
      case 'priority_asc':
        return 'Prioridad (1 → 5)';
      case 'priority_desc':
      default:
        return 'Prioridad (5 → 1)';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black text-accent uppercase">Mi Backlog</h2>
          <p className="text-base-content opacity-70">Juegos pendientes, jugando y completados</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleNewGameClick}
        >
          <Plus size={18} />
          Nuevo Videojuego
        </button>
      </div>

      {/* Menu de botones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-200 border-2 border-base-300 rounded-box p-4 shadow-sm">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
          <input
            type="text"
            placeholder="Buscar videojuegos"
            className="input input-bordered input-sm w-full pl-9 bg-base-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-start md:justify-end">
          <div className="join">
            <button
              className={`btn join-item btn-xs sm:btn-sm ${statusFilter === '' ? 'btn-secondary' : 'btn-ghost bg-base-100 border-base-300'}`}
              onClick={() => setStatusFilter('')}>Todos
            </button>
            <button
              className={`btn join-item btn-xs sm:btn-sm ${statusFilter === 'Jugando' ? 'btn-secondary' : 'btn-ghost bg-base-100 border-base-300'}`}
              onClick={() => setStatusFilter('Jugando')}>Jugando
            </button>
            <button
              className={`btn join-item btn-xs sm:btn-sm ${statusFilter === 'En cola' ? 'btn-secondary' : 'btn-ghost bg-base-100 border-base-300'}`}
              onClick={() => setStatusFilter('En cola')}>En Cola
            </button>
            <button
              className={`btn join-item btn-xs sm:btn-sm ${statusFilter === 'Completado' ? 'btn-secondary' : 'btn-ghost bg-base-100 border-base-300'}`}
              onClick={() => setStatusFilter('Completado')}>Completado
            </button>
          </div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-xs sm:btn-sm border-base-300 bg-base-100 font-bold flex items-center gap-1.5 shadow-sm">
              <span>Ordenar Por: {getSortLabel()}</span>
              <ChevronDown size={14} />
            </div>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-56 z-30 border-2 border-base-300 mt-1">
              <li>
                <button className={sortBy === 'priority_desc' ? 'active' : ''} onClick={() => setSortBy('priority_desc')}>
                  Prioridad (5 → 1)
                </button>
              </li>
              <li>
                <button className={sortBy === 'priority_asc' ? 'active' : ''} onClick={() => setSortBy('priority_asc')}>
                  Prioridad (1 → 5)
                </button>
              </li>
              <li>
                <button className={sortBy === 'title' ? 'active' : ''} onClick={() => setSortBy('title')}>
                  Nombre
                </button>
              </li>
            </ul>
          </div>

          <div className="join border-2 border-base-300 shadow-sm overflow-hidden">
            <button
              className={`btn join-item btn-xs sm:btn-sm ${viewMode === 'grid' ? 'btn-secondary' : 'btn-ghost bg-base-100'}`}
              onClick={() => setViewMode('grid')}
              title="Vista de cuadrícula"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              className={`btn join-item btn-xs sm:btn-sm ${viewMode === 'table' ? 'btn-secondary' : 'btn-ghost bg-base-100'}`}
              onClick={() => setViewMode('table')}
              title="Vista de tabla"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {deleteError && (
        <div className="alert alert-error text-sm">
          <span>{deleteError}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setDeleteError('')}>✕</button>
        </div>
      )}

      {/* Videogame grid / table */}
      {loading ? (
        <div className="flex justify-center items-center p-24">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : games.length === 0 ? (
        <div className="card bg-base-200 border-2 border-base-300 rounded-box p-12 text-center text-base-content opacity-60">
          <p className="font-bold text-lg">No se encontraron videojuegos</p>
          <p className="text-sm mt-1">¡Intenta agregar tus videojuegos pendientes!</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={handleCardClick}
              onEdit={handleEditGameClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border-2 border-base-300">
          <table className="table w-full bg-base-200">
            <thead className="bg-base-300">
              <tr>
                <th className="w-20">Portada</th>
                <th>Título</th>
                <th>Plataforma</th>
                <th className="text-center">Prioridad</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr
                  key={game.id}
                  className="hover:bg-base-300 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleCardClick(game)}
                >
                  <td>
                    {game.cover_path ? (
                      <img
                        src={`http://localhost:5000${game.cover_path}`}
                        alt={game.title}
                        className="w-10 h-14 object-cover rounded shadow-sm border border-base-300 animate-fade-in"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-base-300 rounded flex items-center justify-center border border-base-300">
                        <span className="text-[10px] uppercase font-bold opacity-50 text-center">Nada.</span>
                      </div>
                    )}
                  </td>
                  <td className="font-bold text-base">{game.title}</td>
                  <td className="opacity-80">{game.platform_name || '—'}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-1 font-bold">
                      <span>{game.priority}</span>
                      <span className="text-primary-content">★</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm py-2 font-bold uppercase ${game.status === 'Completado'
                        ? 'badge-success text-success-content'
                        : game.status === 'Jugando'
                          ? 'badge-primary text-primary-content'
                          : 'badge-secondary text-primary-content'
                        }`}
                    >
                      {game.status}
                    </span>
                  </td>
                  <td className="text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-1">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEditGameClick(game)}
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => handleDeleteClick(game)}
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <GameDetailModal
        id="game_detail_modal"
        game={selectedGame}
      />

      <GameModal
        id="game_modal"
        game={gameForModal}
        onSave={fetchGames}
      />

      <ConfirmModal
        id="confirm_delete_game"
        title="Eliminar videojuego"
        message={`¿Seguro que deseas eliminar "${gameToDelete?.title}" de tu backlog?`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default BacklogList;
