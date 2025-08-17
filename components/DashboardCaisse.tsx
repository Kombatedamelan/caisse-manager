"use client";

import React, { useState } from 'react';
import DialogInitialBalance from '@/components/dialogs/DialogInitialBalance';
import DialogNewTransaction from '@/components/dialogs/DialogNewTransaction';
import DialogTransactionList from '@/components/dialogs/DialogTransactionList';
import DialogCloseCash from '@/components/dialogs/DialogCloseCash';

interface Transaction {
  id: string;
  time: string;
  service: string;
  amount: number;
}

export default function DashboardCaisse() {
  const [openingBalance, setOpeningBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('Aucun problème');

  // Calculs
  const totalCollected = transactions.reduce((sum, t) => sum + t.amount, 0);
  const theoreticalBalance = openingBalance ? openingBalance + totalCollected : 0;

  // Handlers
  const handleInitialBalanceSubmit = (amount: number) => {
    if (amount >= 0) {
      setOpeningBalance(amount);
      setAlertMessage('✅ Aucun problème');
    }
  };

  const handleNewTransactionSubmit = (service: string, amount: number) => {
    const time = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const formattedService = service.charAt(0).toUpperCase() + service.slice(1);

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      time,
      service: formattedService,
      amount
    };
    setTransactions([newTransaction, ...transactions]);
    setAlertMessage('✅ Transaction ajoutée.');
  };

  const handleCloseCashSubmit = (countedAmount: number) => {
    if (!openingBalance) return alert("Veuillez saisir un solde initial.");

    const diff = countedAmount - theoreticalBalance;

    if (diff === 0) {
      setAlertMessage("✅ Aucun écart détecté. Caisse clôturée.");
    } else if (diff > 0) {
      setAlertMessage(`⚠️ Il y a un excédent de ${Math.abs(diff)} FCFA.`);
    } else {
      setAlertMessage(`🔴 Il manque ${Math.abs(diff)} FCFA.`);
    }

    setOpeningBalance(null);
    setTransactions([]);
  };

  // Recettes d'hier (statique)
  const yesterdayData = [
    { service: 'Consultation', amount: 42000 },
    { service: 'Urgences', amount: 30000 },
    { service: 'Pharmacie', amount: 28000 },
  ];
  const totalYesterday = yesterdayData.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="container bg-[#f0fef4] mx-auto pt-5 pb-5 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-sm text-gray-600 mt-2">
          Bienvenue dans le système de gestion de caisse
        </p>
      </header>

      {/* Informations personnelles */}
      <section className="mb-8 p-5 rounded-lg shadow-md bg-white">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Informations Personnelles</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Nom & Prénom :</strong> Awa Diop</li>
          <li><strong>Fonction :</strong> Caissière principale</li>
          <li><strong>Email :</strong> awa.diop@hopitalxyz.sn</li>
          <li><strong>Téléphone :</strong> +221 77 456 78 90</li>
        </ul>
      </section>

      {/* Soldes clés */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-700">Solde d’ouverture</h3>
          <p className="text-lg text-gray-900">
            {openingBalance !== null ? `${openingBalance.toLocaleString()} FCFA` : 'Non saisi'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-700">Total encaissé</h3>
          <p className="text-lg text-gray-900">{totalCollected.toLocaleString()} FCFA</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <h3 className="font-semibold text-gray-700">Solde théorique</h3>
          <p className="text-lg text-gray-900">{theoreticalBalance.toLocaleString()} FCFA</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <h3 className="font-semibold text-gray-700">État</h3>
          <p
            className={`text-lg ${
              alertMessage.startsWith('✅')
                ? 'text-green-600'
                : alertMessage.startsWith('⚠️')
                ? 'text-yellow-600'
                : alertMessage.startsWith('🔴')
                ? 'text-red-600'
                : 'text-gray-700'
            }`}
          >
            {alertMessage}
          </p>
        </div>
      </section>

      {/* Boutons rapides */}
      <section className="flex flex-wrap gap-4 mb-8">
        <DialogInitialBalance onSubmit={handleInitialBalanceSubmit} />
        <DialogNewTransaction onSubmit={handleNewTransactionSubmit} disabled={!openingBalance} />
        <DialogTransactionList transactions={transactions} />
        <DialogCloseCash onSubmit={handleCloseCashSubmit} disabled={!openingBalance && transactions.length === 0} />
      </section>

      {/* Recettes d'hier */}
      <section className="mb-8 p-6 rounded-lg shadow bg-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recettes d’hier</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {yesterdayData.map((item, i) => (
            <div key={i} className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <p className="font-medium text-gray-700">{item.service}</p>
              <p className="text-lg font-bold text-gray-900">{item.amount.toLocaleString()} FCFA</p>
            </div>
          ))}
          <div className="p-4 border-l-4 border-green-600 bg-green-100 rounded">
            <p className="font-medium text-gray-700">Total</p>
            <p className="text-lg font-bold text-gray-900">{totalYesterday.toLocaleString()} FCFA</p>
          </div>
        </div>
      </section>
    </div>
  );
}
