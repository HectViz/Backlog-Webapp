import React from 'react';

function ConfirmModal({ id, title, message, onConfirm }) {
  const handleConfirm = () => {
    document.getElementById(id).close();
    onConfirm();
  };

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-black text-lg">{title}</h3>
        <p className="py-4 text-sm opacity-80">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-ghost mr-2">Cancelar</button>
          </form>
          <button className="btn btn-error" onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default ConfirmModal;
