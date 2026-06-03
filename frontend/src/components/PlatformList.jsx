import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PlatformModal from './PlatformModal';
import ConfirmModal from './ConfirmModal';

function PlatformList() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformToDelete, setPlatformToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/platforms');
      const data = await response.json();
      setPlatforms(data);
    } catch (err) {
      console.error('Error al cargar plataformas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPlatform = () => {
    setSelectedPlatform(null);
    document.getElementById('platform_modal').showModal();
  };

  const handleEditPlatform = (platform) => {
    setSelectedPlatform(platform);
    document.getElementById('platform_modal').showModal();
  };

  const handleDeleteClick = (platform) => {
    setDeleteError('');
    setPlatformToDelete(platform);
    document.getElementById('confirm_delete_platform').showModal();
  };

  const handleConfirmDelete = async () => {
    if (!platformToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/platforms/${platformToDelete.id}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      if (!response.ok) {
        setDeleteError(data.error || 'No se pudo eliminar.');
        return;
      }
      fetchPlatforms();
    } catch (err) {
      setDeleteError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black text-accent uppercase">Plataformas</h2>
          <p className="text-base-content opacity-70">Consolas y sistemas de juego registrados</p>
        </div>
        <button className="btn btn-secondary" onClick={handleNewPlatform}>
          <Plus size={18} />
          Nueva Plataforma
        </button>
      </div>

      {deleteError && (
        <div className="alert alert-error text-sm">
          <span>{deleteError}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setDeleteError('')}>✕</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-box border-2 border-base-300">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : platforms.length === 0 ? (
          <div className="text-center p-12 text-base-content opacity-60">
            <p className="font-semibold">Empieza a registrar plataformas.</p>
            <p className="text-sm mt-1">Dale, crea una nueva para comenzar.</p>
          </div>
        ) : (
          <table className="table table-zebra w-full">
            <thead className="bg-base-300">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Fabricante</th>
                <th>Descripción</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((platform) => (
                <tr key={platform.id}>
                  <td className="font-mono opacity-50 text-sm">{platform.id}</td>
                  <td className="font-bold">{platform.name}</td>
                  <td className="opacity-80">{platform.manufacturer}</td>
                  <td className="text-sm opacity-70 max-w-xs truncate">
                    {platform.description || '—'}
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEditPlatform(platform)}
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => handleDeleteClick(platform)}
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

      <PlatformModal
        id="platform_modal"
        platform={selectedPlatform}
        onSave={fetchPlatforms}
      />

      <ConfirmModal
        id="confirm_delete_platform"
        title="Eliminar plataforma"
        message={`¿Seguro que deseas eliminar "${platformToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default PlatformList;
