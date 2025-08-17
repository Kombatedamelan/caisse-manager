'use client';

import React, { useState } from 'react';

interface Props {
  onSubmit: (service: string, amount: number) => void;
  disabled: boolean;
}

export default function DialogNewTransaction({ onSubmit, disabled }: Props) {
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(amount);
    if (!service || isNaN(value) || value < 0) {
      alert("Veuillez saisir un service et un montant valide.");
      return;
    }
    onSubmit(service, value);
    setService('');
    setAmount('');
    (document.getElementById('new-transaction-dialog') as HTMLDialogElement)?.close();
  };

  return (
    <>
      <button
        onClick={() => document.getElementById('new-transaction-dialog')?.showModal()}
        disabled={disabled}
        className={`flex-1 sm:flex-none px-6 py-3 font-medium rounded shadow transition-colors ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        💰 Nouvelle transaction
      </button>

      <dialog id="new-transaction-dialog" className="rounded-md p-6 w-full max-w-md backdrop:bg-black/40">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Nouvelle transaction</h2>

          <input
            type="text"
            placeholder="Service (ex: Consultation)"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="number"
            placeholder="Montant (FCFA)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => (document.getElementById('new-transaction-dialog') as HTMLDialogElement)?.close()}
              className="px-4 py-2 rounded border text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
