'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Props {
  onSubmit: (amount: number) => void;
}

export default function DialogInitialBalance({ onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(amount);
    if (!isNaN(value) && value >= 0) {
      onSubmit(value);
      setAmount('');
      setIsOpen(false);
    } else {
      alert('Veuillez entrer un montant valide.');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow"
      >
        ➕ Ouvrir la caisse
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Ouvrir la caisse</DialogTitle>
              <DialogDescription>Saisissez le montant de départ de la caisse.</DialogDescription>
            </DialogHeader>

            <input
              type="number"
              placeholder="Montant d'ouverture"
              name="soldeinitial"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
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
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
