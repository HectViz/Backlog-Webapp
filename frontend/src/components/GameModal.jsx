import React, { useState, useEffect } from 'react';

function GameModal({ id, game, onSave }) {
  const [title, setTitle] = useState('');
  const [platformId, setPlatformId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [status, setStatus] = useState('En cola');
  const [priority, setPriority] = useState(3);
  const [cover, setCover] = useState(null);
  const [review, setReview] = useState('');
  const [removeCover, setRemoveCover] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlatforms();
    fetchGenres();
  }, []);

  useEffect(() => {
    if (game) {
      setTitle(game.title || '');
      setPlatformId(game.platform_id || '');
      setGenreId(game.genre_id || '');
      setStatus(game.status || 'En cola');
      setPriority(game.priority || 3);
      setReview(game.review || '');
      setCover(null);
      setRemoveCover(false);
    } else {
      setTitle('');
      setPlatformId('');
      setGenreId('');
      setStatus('En cola');
      setPriority(3);
      setReview('');
      setCover(null);
      setRemoveCover(false);
    }
    setError('');
  }, [game]);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/platforms');
      const data = await response.json();
      setPlatforms(data);
    } catch (err) {
      console.error('Error al cargar plataformas:', err);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/genres');
      const data = await response.json();
      setGenres(data);
    } catch (err) {
      console.error('Error al cargar géneros:', err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCover(e.target.files[0]);
      setRemoveCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título del videojuego es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const url = game
        ? `http://localhost:5000/api/games/${game.id}`
        : 'http://localhost:5000/api/games';

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('platform_id', platformId);
      formData.append('genre_id', genreId);
      formData.append('status', status);
      formData.append('priority', priority.toString());
      formData.append('review', review.trim());

      if (cover) {
        formData.append('cover', cover);
      }
      if (game) {
        formData.append('remove_cover', removeCover ? 'true' : 'false');
      }

      const response = await fetch(url, {
        method: game ? 'PUT' : 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ocurrió un error al guardar');
        setLoading(false);
        return;
      }

      document.getElementById(id).close();
      onSave();
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
              className="input input-bordered w-full"
              placeholder="Ej: Hollow Knight"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Plataforma</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={platformId}
                onChange={(e) => setPlatformId(e.target.value)}
              >
                <option value="">Selecciona plataforma</option>
                {platforms.map((p) => (
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
                className="select select-bordered w-full"
                value={genreId}
                onChange={(e) => setGenreId(e.target.value)}
              >
                <option value="">Selecciona género</option>
                {genres.map((g) => (
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
                className="select select-bordered w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
                className="select select-bordered w-full"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value))}
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
              className="file-input file-input-bordered file-input-sm w-full"
              accept="image/*"
              onChange={handleFileChange}
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
              className="textarea textarea-bordered w-full"
              placeholder="Escribe una nota o una reseña"
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
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
