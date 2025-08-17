'use client';

import React, { useState } from 'react';

interface Props {
  onSubmit: (amount: number) => void;
  disabled: boolean;
}

export default function DialogCloseCash({ onSubmit, disabled }: Props) {
  const [countedAmount, setCountedAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(countedAmount);
    if (isNaN(value) || value < 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }
    onSubmit(value);
    setCountedAmount('');
    (document.getElementById('close-cash-dialog') as HTMLDialogElement)?.close();
  };

  return (
    <>
      <button
        onClick={() => document.getElementById('close-cash-dialog')?.showModal()}
        disabled={disabled}
        className={`flex-1 sm:flex-none px-6 py-3 font-medium rounded shadow transition-colors ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        📌 Clôturer Caisse
      </button>

      {/* Modal native HTML dialog */}
      <dialog id="close-cash-dialog" className="rounded-md p-6 w-full max-w-md backdrop:bg-black/40">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Clôturer la caisse</h2>
          <p className="text-sm text-gray-600">Entrez le montant réellement compté pour clôturer la caisse.</p>

          <input
            type="number"
            placeholder="Montant compté"
            value={countedAmount}
            onChange={(e) => setCountedAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => (document.getElementById('close-cash-dialog') as HTMLDialogElement)?.close()}
              className="px-4 py-2 rounded border text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Valider
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
