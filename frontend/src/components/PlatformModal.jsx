import React, { useState, useEffect } from 'react';

function PlatformModal({ id, platform, onSave }) {
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (platform) {
      setName(platform.name || '');
      setManufacturer(platform.manufacturer || '');
      setDescription(platform.description || '');
    } else {
      setName('');
      setManufacturer('');
      setDescription('');
    }
    setError('');
  }, [platform]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !manufacturer.trim()) {
      setError('Rellena los campos obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const url = platform
        ? `http://localhost:5000/api/platforms/${platform.id}`
        : 'http://localhost:5000/api/platforms';

      const method = platform ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          manufacturer: manufacturer.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ocurrió un error al guardar.');
        setLoading(false);
        return;
      }

      document.getElementById(id).close();
      onSave();
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
              className="input input-bordered w-full"
              placeholder="Ej: PlayStation 5"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Fabricante *</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Ej: Sony"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Descripción</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Descripción breve de la plataforma"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <div className="alert alert-error text-sm py-2">
              <span>{error}</span>
            </div>
          )}

          <div className="modal-action mt-0">
            <form method="dialog">
              <button type="submit" className="btn btn-ghost mr-2">
                Cancelar
              </button>
            </form>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : null}
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
