import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addGame, updateGame } from '../store/gamesSlice';
import { fetchPlatforms } from '../store/platformsSlice';
import { fetchGenres } from '../store/genresSlice';
import useFetch from '../hooks/useFetch';
import useForm from '../hooks/useForm';

function GameModal({ id, game, onSave }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [removeCover, setRemoveCover] = useState(false);

  const { data: platforms } = useFetch(fetchPlatforms, (state) => state.platforms);
  const { data: genres } = useFetch(fetchGenres, (state) => state.genres);

  const { values, handleChange, resetForm, setFieldValue } = useForm({
    title: '',
    platformId: '',
    genreId: '',
    status: 'En cola',
    priority: 3,
    cover: null,
    review: '',
  });

  useEffect(() => {
    if (game) {
      resetForm({
        title: game.title || '',
        platformId: game.platform_id || '',
        genreId: game.genre_id || '',
        status: game.status || 'En cola',
        priority: game.priority || 3,
        cover: null,
        review: game.review || '',
      });
    } else {
      resetForm({
        title: '',
        platformId: '',
        genreId: '',
        status: 'En cola',
        priority: 3,
        cover: null,
        review: '',
      });
    }
    setRemoveCover(false);
    setError('');
  }, [game, resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!values.title.trim()) {
      setError('El título del videojuego es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title.trim());
      formData.append('platform_id', values.platformId);
      formData.append('genre_id', values.genreId);
      formData.append('status', values.status);
      formData.append('priority', values.priority.toString());
      formData.append('review', values.review.trim());

      if (values.cover) {
        formData.append('cover', values.cover);
      }
      if (game) {
        formData.append('remove_cover', removeCover ? 'true' : 'false');
      }

      let resultAction;
      if (game) {
        resultAction = await dispatch(updateGame({ id: game.id, formData }));
      } else {
        resultAction = await dispatch(addGame(formData));
      }

      if (addGame.fulfilled.match(resultAction) || updateGame.fulfilled.match(resultAction)) {
        document.getElementById(id).close();
        if (onSave) onSave();
      } else {
        setError(resultAction.payload || 'Ocurrió un error al guardar');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-black text-lg mb-4">
          {game ? 'Editar Videojuego' : 'Nuevo Videojuego'}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Título del Videojuego *</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-bordered w-full"
              placeholder="Ej: Hollow Knight"
              value={values.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Plataforma</span>
              </label>
              <select
                name="platformId"
                className="select select-bordered w-full"
                value={values.platformId}
                onChange={handleChange}
              >
                <option value="">Selecciona plataforma</option>
                {platforms && platforms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Género</span>
              </label>
              <select
                name="genreId"
                className="select select-bordered w-full"
                value={values.genreId}
                onChange={handleChange}
              >
                <option value="">Selecciona género</option>
                {genres && genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Estado *</span>
              </label>
              <select
                name="status"
                className="select select-bordered w-full"
                value={values.status}
                onChange={handleChange}
              >
                <option value="En cola">En Cola</option>
                <option value="Jugando">Jugando</option>
                <option value="Completado">Completado</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Prioridad o Rating *</span>
              </label>
              <select
                name="priority"
                className="select select-bordered w-full"
                value={values.priority}
                onChange={(e) => setFieldValue('priority', parseInt(e.target.value, 10))}
              >
                <option value={1}>1 - Muy Baja</option>
                <option value={2}>2 - Baja</option>
                <option value={3}>3 - Media</option>
                <option value={4}>4 - Alta</option>
                <option value={5}>5 - Muy Alta</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Portada (Imagen)</span>
            </label>
            <input
              type="file"
              name="cover"
              className="file-input file-input-bordered file-input-sm w-full"
              accept="image/*"
              onChange={handleChange}
            />
            {game && game.cover_path && !removeCover && (
              <div className="flex items-center justify-between mt-2 bg-base-300 p-2 rounded-lg text-xs">
                <span className="opacity-75 truncate max-w-[150px]">Imagen existente</span>
                <button
                  type="button"
                  className="btn btn-error btn-xs btn-outline"
                  onClick={() => setRemoveCover(true)}
                >
                  Eliminar
                </button>
              </div>
            )}
            {removeCover && (
              <div className="text-xs text-error mt-2 font-semibold">
                Se eliminará la portada existente al guardar
              </div>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nota</span>
            </label>
            <textarea
              name="review"
              className="textarea textarea-bordered w-full"
              placeholder="Escribe una nota o una reseña"
              rows={3}
              value={values.review}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          <div className="modal-action mt-2">
            <button
              type="button"
              className="btn btn-ghost mr-2"
              onClick={() => document.getElementById(id).close()}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-secondary" disabled={loading}>
              {loading && <span className="loading loading-spinner loading-sm" />}
              {game ? 'Guardar Cambios' : 'Crear Videojuego'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default GameModal;
