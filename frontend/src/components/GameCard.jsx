import React from 'react';
import { Pencil, Trash2, Gamepad2, Star } from 'lucide-react';

function GameCard({ game, onClick, onEdit, onDelete }) {
  const coverUrl = game.cover_path
    ? `http://localhost:5000${game.cover_path}`
    : null;

  return (
    <div
      onClick={() => onClick(game)}
      className="relative group overflow-hidden rounded-box border-2 border-base-300 bg-base-200 shadow-md hover:shadow-xl hover:border-accent/50 transition-all duration-300 cursor-pointer flex flex-col aspect-[2/3] w-full max-w-[280px]"
    >
      <div className="flex-1 min-h-0 relative overflow-hidden bg-base-300">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="text-center">
              <Gamepad2 className="w-8 h-8 mx-auto mb-2 opacity-30 text-base-content" />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-45">Sin Imagen</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col justify-between bg-base-200 border-t border-base-300 gap-2">
        <h4 className="font-bold text-sm line-clamp-2 leading-tight text-center group-hover:text-accent transition-colors duration-200">
          {game.title}
        </h4>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-1 font-bold text-xs text-base-content px-2 select-none">
            <span>{game.priority}</span>
            <Star size={12} className="fill-base-content text-base-content" />
          </div>

          <div className="flex gap-1">
            <button
              className="btn btn-circle btn-xs btn-ghost hover:bg-base-300 text-base-content border-none"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(game);
              }}
              title="Editar"
            >
              <Pencil size={12} />
            </button>
            <button
              className="btn btn-circle btn-xs btn-ghost hover:bg-error hover:text-error-content text-base-content border-none"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(game);
              }}
              title="Eliminar"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
