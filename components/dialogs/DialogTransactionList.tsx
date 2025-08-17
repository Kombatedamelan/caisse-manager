'use client';

import React from 'react';

interface Transaction {
  id: string;
  time: string;
  service: string;
  amount: number;
}

interface Props {
  transactions: Transaction[];
}

export default function DialogTransactionList({ transactions }: Props) {
  return (
    <>
      <button
        onClick={() => document.getElementById('transaction-list-dialog')?.showModal()}
        className="flex-1 sm:flex-none px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded shadow"
      >
        📄 Voir transactions
      </button>

      <dialog id="transaction-list-dialog" className="rounded-md p-6 w-full max-w-2xl backdrop:bg-black/40">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Liste des Transactions</h2>

          {transactions.length === 0 ? (
            <p className="text-gray-600">Aucune transaction enregistrée.</p>
          ) : (
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Heure</th>
                  <th className="px-4 py-2 text-left">Service</th>
                  <th className="px-4 py-2 text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-2">{t.time}</td>
                    <td className="px-4 py-2">{t.service}</td>
                    <td className="px-4 py-2 text-right">{t.amount.toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={() => (document.getElementById('transaction-list-dialog') as HTMLDialogElement)?.close()}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Fermer
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
