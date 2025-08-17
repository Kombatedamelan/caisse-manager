"use client"



import React from 'react';

export default function HistoriqueSection() {
  return (
    <section className="pt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--dark)] mb-4">Historique des consultations</h1>
      <p className="text-gray-600 mb-4">Voici les consultations effectuées aujourd'hui.</p>
      <div className="bg-white shadow rounded-lg p-5 border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">Patient</th>
              <th className="px-4 py-2 text-left text-gray-700 font-medium">Acte</th>
              <th className="px-4 py-2 text-right text-gray-700 font-medium">Montant</th>
              <th className="px-4 py-2 text-right text-gray-700 font-medium">Mode de paiement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-2">Jean Dupont</td>
              <td className="px-4 py-2">Consultation générale</td>
              <td className="px-4 py-2 text-right">50 €</td>
              <td className="px-4 py-2 text-right">Assurance</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Sophie Leroy</td>
              <td className="px-4 py-2">Radio du thorax</td>
              <td className="px-4 py-2 text-right">80 €</td>
              <td className="px-4 py-2 text-right">Cash</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
