import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addGenre, updateGenre } from '../store/genresSlice';
import useForm from '../hooks/useForm';

function GenreModal({ id, genre, onSave }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { values, handleChange, resetForm } = useForm({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (genre) {
      resetForm({
        name: genre.name || '',
        description: genre.description || '',
      });
    } else {
      resetForm({
        name: '',
        description: '',
      });
    }
    setError('');
  }, [genre, resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!values.name || !values.name.trim()) {
      setError('El nombre del género es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      let resultAction;
      if (genre) {
        resultAction = await dispatch(
          updateGenre({
            id: genre.id,
            genreData: {
              name: values.name.trim(),
              description: values.description ? values.description.trim() : '',
            },
          })
        );
      } else {
        resultAction = await dispatch(
          addGenre({
            name: values.name.trim(),
            description: values.description ? values.description.trim() : '',
          })
        );
      }

      if (addGenre.fulfilled.match(resultAction) || updateGenre.fulfilled.match(resultAction)) {
        document.getElementById(id).close();
        if (onSave) onSave();
      } else {
        setError(resultAction.payload || 'Ocurrió un error al guardar.');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-black text-lg mb-4">
          {genre ? 'Editar Género' : 'Nuevo Género'}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nombre *</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              placeholder="Ej: RPG (Rol), Acción, Metroidvania"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Descripción</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered w-full"
              placeholder="Descripción breve del género"
              rows={3}
              value={values.description}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          <div className="modal-action mt-0">
            <button
              type="button"
              className="btn btn-ghost mr-2"
              onClick={() => document.getElementById(id).close()}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <span className="loading loading-spinner loading-sm" />}
              {genre ? 'Guardar Cambios' : 'Crear Género'}
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

export default GenreModal;
