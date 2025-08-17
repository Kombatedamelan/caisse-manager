"use client"




import React, { useState } from 'react';
import NewPatientModal from './NewPatientModal';

export default function CaisseSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="pt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-[var(--dark)]">Caisse</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-full hover:bg-[var(--secondary)] flex items-center"
        >
          <i className="fas fa-user-plus mr-2"></i> Nouveau Patient
        </button>
      </div>

      {/* Recherche patient */}
      <div className="bg-white shadow rounded-lg p-5 border-l-4 border-[var(--secondary)] mb-6">
        <h2 className="text-xl font-bold text-[var(--dark)] mb-4">Rechercher un patient</h2>
        <input
          type="text"
          placeholder="Rechercher par nom ou ID"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--accent)] outline-none"
          defaultValue="Jean Dupont (P001)"
        />
        <ul className="max-h-40 overflow-y-auto space-y-1 mt-2">
          <li className="p-2 rounded bg-gray-100">Jean Dupont (P001)</li>
          <li className="p-2 rounded hover:bg-gray-100 cursor-pointer">Marie Curie (P002)</li>
          <li className="p-2 rounded hover:bg-gray-100 cursor-pointer">Luc Martin (P003)</li>
        </ul>
      </div>

      {/* Recherche acte médical */}
      <div className="bg-white shadow rounded-lg p-5 border-l-4 border-[var(--primary)] mb-6">
        <h2 className="text-xl font-bold text-[var(--dark)] mb-4">Rechercher un acte médical</h2>
        <input
          type="text"
          placeholder="Rechercher par description ou code"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--accent)] outline-none"
        />
        <ul className="max-h-40 overflow-y-auto space-y-2 mt-2">
          <li className="flex justify-between items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
            <span>Consultation générale - 50 €</span>
            <button className="px-3 py-1 bg-[var(--primary)] text-white rounded text-sm hover:bg-[var(--secondary)]">
              <i className="fas fa-plus"></i>
            </button>
          </li>
          <li className="flex justify-between items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
            <span>Radio du thorax - 80 €</span>
            <button className="px-3 py-1 bg-[var(--primary)] text-white rounded text-sm hover:bg-[var(--secondary)]">
              <i className="fas fa-plus"></i>
            </button>
          </li>
        </ul>
      </div>

      {/* Modal */}
      <NewPatientModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
