import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addPlatform, updatePlatform } from '../store/platformsSlice';
import useForm from '../hooks/useForm';

function PlatformModal({ id, platform, onSave }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { values, handleChange, resetForm } = useForm({
    name: '',
    manufacturer: '',
    description: '',
  });

  useEffect(() => {
    if (platform) {
      resetForm({
        name: platform.name || '',
        manufacturer: platform.manufacturer || '',
        description: platform.description || '',
      });
    } else {
      resetForm({
        name: '',
        manufacturer: '',
        description: '',
      });
    }
    setError('');
  }, [platform, resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!values.name.trim() || !values.manufacturer.trim()) {
      setError('Rellena los campos obligatorios.');
      return;
    }

    setLoading(true);
    try {
      let resultAction;
      if (platform) {
        resultAction = await dispatch(
          updatePlatform({
            id: platform.id,
            platformData: {
              name: values.name.trim(),
              manufacturer: values.manufacturer.trim(),
              description: values.description ? values.description.trim() : '',
            },
          })
        );
      } else {
        resultAction = await dispatch(
          addPlatform({
            name: values.name.trim(),
            manufacturer: values.manufacturer.trim(),
            description: values.description ? values.description.trim() : '',
          })
        );
      }

      if (addPlatform.fulfilled.match(resultAction) || updatePlatform.fulfilled.match(resultAction)) {
        document.getElementById(id).close();
        if (onSave) onSave();
      } else {
        setError(resultAction.payload || 'Ocurrió un error al guardar.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-black text-lg mb-4">
          {platform ? 'Editar Plataforma' : 'Nueva Plataforma'}
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
              placeholder="Ej: PlayStation 5"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Fabricante *</span>
            </label>
            <input
              type="text"
              name="manufacturer"
              className="input input-bordered w-full"
              placeholder="Ej: Sony"
              value={values.manufacturer}
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
              placeholder="Descripción breve de la plataforma"
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
              {platform ? 'Guardar Cambios' : 'Crear Plataforma'}
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

export default PlatformModal;
