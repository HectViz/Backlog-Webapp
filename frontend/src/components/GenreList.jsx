import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { fetchGenres, deleteGenre } from '../store/genresSlice';
import GenreModal from './GenreModal';
import ConfirmModal from './ConfirmModal';
import useTitle from '../hooks/useTitle';

function GenreList() {
  useTitle('Géneros');
  const dispatch = useDispatch();
  const { data: genres, loading, error } = useFetch(fetchGenres, (state) => state.genres);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreToDelete, setGenreToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const handleNewGenre = () => {
    setSelectedGenre(null);
    document.getElementById('genre_modal').showModal();
  };

  const handleEditGenre = (genre) => {
    setSelectedGenre(genre);
    document.getElementById('genre_modal').showModal();
  };

  const handleDeleteClick = (genre) => {
    setDeleteError('');
    setGenreToDelete(genre);
    document.getElementById('confirm_delete_genre').showModal();
  };

  const handleConfirmDelete = async () => {
    if (!genreToDelete) return;
    try {
      const resultAction = await dispatch(deleteGenre(genreToDelete.id));
      if (deleteGenre.rejected.match(resultAction)) {
        setDeleteError(resultAction.payload || 'No se pudo eliminar el género.');
      }
    } catch (err) {
      setDeleteError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black text-accent uppercase">Géneros</h2>
          <p className="text-base-content opacity-70">Géneros o categorías de videojuegos registrados</p>
        </div>
        <button className="btn btn-secondary" onClick={handleNewGenre}>
          <Plus size={18} />
          Nuevo Género
        </button>
      </div>

      {deleteError && (
        <div className="alert alert-error text-sm">
          <span>{deleteError}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setDeleteError('')}>✕</button>
        </div>
      )}

      {error && (
        <div className="alert alert-error text-sm">
          <span>Error al obtener géneros: {error}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-box border-2 border-base-300">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : !genres || genres.length === 0 ? (
          <div className="text-center p-12 text-base-content opacity-60">
            <p className="font-semibold">Empieza a registrar géneros.</p>
            <p className="text-sm mt-1">Crea un género nuevo categorizar tus videojuegos.</p>
          </div>
        ) : (
          <table className="table table-zebra w-full">
            <thead className="bg-base-300">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => (
                <tr key={genre.id}>
                  <td className="font-mono opacity-50 text-sm">{genre.id}</td>
                  <td className="font-bold">{genre.name}</td>
                  <td className="text-sm opacity-70 max-w-xs truncate">
                    {genre.description || '—'}
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEditGenre(genre)}
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => handleDeleteClick(genre)}
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
        )}
      </div>

      <GenreModal
        id="genre_modal"
        genre={selectedGenre}
      />

      <ConfirmModal
        id="confirm_delete_genre"
        title="Eliminar género"
        message={`¿Seguro que deseas eliminar el género "${genreToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default GenreList;
