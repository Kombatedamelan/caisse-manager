"use client";

import React, { useMemo, useState } from "react";

type HistoriqueItem = {
  id: string;
  date: string;
  patientName: string;
  actes: { description: string; price: number; quantity: number }[];
  montantTotal: number;
};

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getStartOfWeek(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

const mockData: HistoriqueItem[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    patientName: "Jean Dupont",
    actes: [
      { description: "Consultation", price: 50, quantity: 1 },
      { description: "Radio", price: 30, quantity: 1 },
    ],
    montantTotal: 80,
  },
  {
    id: "2",
    date: new Date().toISOString(),
    patientName: "Marie Curie",
    actes: [{ description: "Analyse sang", price: 100, quantity: 1 }],
    montantTotal: 100,
  },
  {
    id: "3",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    patientName: "Thomas Edison",
    actes: [{ description: "ECG", price: 60, quantity: 1 }],
    montantTotal: 60,
  },
  {
    id: "4",
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    patientName: "Albert Einstein",
    actes: [
      { description: "Scanner", price: 120, quantity: 1 },
      { description: "Consultation", price: 50, quantity: 1 },
    ],
    montantTotal: 170,
  },
];

export default function Historique() {
  const [period, setPeriod] = useState<"today" | "yesterday" | "thisWeek" | "thisMonth" | "all">("all");
  const [searchName, setSearchName] = useState("");

  const filteredData = useMemo(() => {
    const now = new Date();

    return mockData.filter((item) => {
      const itemDate = new Date(item.date);
      let periodMatch = false;

      switch (period) {
        case "today":
          periodMatch = isSameDay(itemDate, now);
          break;
        case "yesterday": {
          const y = new Date(now);
          y.setDate(now.getDate() - 1);
          periodMatch = isSameDay(itemDate, y);
          break;
        }
        case "thisWeek": {
          const start = getStartOfWeek(new Date(now));
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          periodMatch = itemDate >= start && itemDate <= end;
          break;
        }
        case "thisMonth":
          periodMatch =
            itemDate.getFullYear() === now.getFullYear() &&
            itemDate.getMonth() === now.getMonth();
          break;
        default:
          periodMatch = true;
      }

      const nameMatch = item.patientName
        .toLowerCase()
        .includes(searchName.toLowerCase());

      return periodMatch && nameMatch;
    });
  }, [period, searchName]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Historique des paiements
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par nom"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="flex-grow border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="all">Tout</option>
            <option value="today">Aujourd'hui</option>
            <option value="yesterday">Hier</option>
            <option value="thisWeek">Cette semaine</option>
            <option value="thisMonth">Ce mois</option>
          </select>
        </div>

        <div className="overflow-auto max-h-[500px] rounded border border-gray-200">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Patient</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Actes</th>
                <th className="text-right px-6 py-4 font-semibold text-gray-700">Total (€)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400 italic">
                    Aucun résultat trouvé.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="even:bg-white odd:bg-gray-50 hover:bg-green-50 transition duration-150"
                  >
                    <td className="px-6 py-3">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{item.patientName}</td>
                    <td className="px-6 py-3 text-sm text-gray-700 space-y-1">
                      {item.actes.map((acte, i) => (
                        <div key={i}>
                          {acte.description} x{acte.quantity} ({acte.price} €)
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-gray-900">
                      {item.montantTotal.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
