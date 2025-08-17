"use client"


import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function PointDeCaisseSection() {
  const chartRef = useRef(null);
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Consultation', 'Radio', 'Analyse', 'Chirurgie'],
        datasets: [
          {
            label: 'Revenus (€)',
            data: [1500, 800, 1200, 600],
            backgroundColor: 'var(--primary)',
            borderColor: 'var(--dark)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true } },
      },
    });

    return () => myChart.destroy();
  }, []);

  return (
    <section className="pt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--dark)] mb-4">Point de caisse</h1>
      <p className="text-gray-600 mb-4">Aperçu des revenus par type d'acte pour aujourd'hui.</p>
      <div className="bg-white shadow rounded-lg p-5 border border-gray-200">
        <canvas ref={chartRef} className="w-full h-64" />
      </div>
    </section>
  );
}
