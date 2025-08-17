"use client"



import React from 'react';

export default function NewPatientModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white text-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-[var(--dark)] mb-4">Nouveau Patient</h2>
        <div className="space-y-4">
          {/* Form inputs simplified */}
          <input
            type="text"
            placeholder="Nom complet"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--accent)] outline-none"
          />
          <input
            type="text"
            placeholder="ID"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--accent)] outline-none"
          />
          {/* ... autres inputs ici */}
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
