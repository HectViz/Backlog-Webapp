import React from 'react';
import { Layers, Star, X } from 'lucide-react';

function GameDetailModal({ id, game }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Jugando':
        return 'badge-primary';
      case 'En cola':
        return 'badge-secondary';
      case 'Completado':
        return 'badge-success text-success-content';
      default:
        return 'badge-ghost';
    }
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      {game ? (
        <div className="modal-box max-w-md border-2 border-base-300 p-6">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`badge ${getStatusBadge(game.status)} font-bold text-xs uppercase`}>
                  {game.status}
                </span>
                <span className="badge badge-outline border-accent text-accent font-bold text-xs flex items-center gap-1 select-none">
                  {game.priority} <Star size={10} className="fill-accent text-accent" />
                </span>
              </div>
              <h3 className="text-2xl font-black uppercase text-base-content leading-tight">
                {game.title}
              </h3>
            </div>

            <form method="dialog">
              <button className="btn btn-circle btn-sm btn-ghost">
                <X size={16} />
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2.5 border-b-2 border-base-300 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-60 font-bold uppercase w-24">Plataforma:</span>
                <span className="font-semibold text-sm flex items-center gap-1">
                  <Layers size={14} className="text-primary" />
                  {game.platform_name || 'Sin Especificar'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-60 font-bold uppercase w-24">Género:</span>
                <span className="font-semibold text-sm text-base-content">
                  {game.genre_name || 'Sin Especificar'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs opacity-60 block font-bold uppercase mb-1.5">Nota</span>
              <div className="bg-base-200 border-2 border-base-300 rounded-box p-4 text-sm leading-relaxed whitespace-pre-line text-base-content min-h-[80px]">
                {game.review && game.review.trim() !== ''
                  ? game.review
                  : 'Este videojuego no tiene ninguna reseña o nota :('}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="modal-box max-w-md border-2 border-base-300 p-6 flex justify-center items-center h-48">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      )}

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default GameDetailModal;
