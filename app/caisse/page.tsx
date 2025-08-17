"use client";

import React, { useState, useEffect } from "react";
import NewPatient from "../../components/NewPatient";

export default function CaissePage() {
  const [acteFilter, setActeFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("Tous Services");
  const [actes, setActes] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [montantDonne, setMontantDonne] = useState("");

  useEffect(() => {
    fetch("http://localhost:5095/api/v1/users")
      .then(res => res.json())
      .then(res => setPatients(res?.data?.docs ?? []))
      .catch(err => {
        console.error("Erreur fetch patients:", err);
        setPatients([]);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5095/api/v1/departementservices")
      .then(res => res.json())
      .then(res => setActes(res?.data?.docs ?? []))
      .catch(err => {
        console.error("Erreur fetch actes:", err);
        setActes([]);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5095/api/v1/typeservices")
      .then(res => res.json())
      .then(res => setServices(res?.data?.docs ?? []))
      .catch(err => {
        console.error("Erreur fetch services:", err);
        setServices([]);
      });
  }, []);

  const filteredPatients = patients.filter((patient) =>
    [patient.lastname, patient.firstname, patient._id]
      .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredActes = actes.filter((acte) => {
    const matchesSearch = acte._id?.toLowerCase().includes(acteFilter.toLowerCase());
    const matchesServices = serviceFilter === "Tous Services" || acte.typeservice?.name === serviceFilter;
    return matchesSearch && matchesServices;
  });

  function addActeToCart(acte) {
    const existing = cart.find((item) => item._id === acte._id);
    if (existing) {
      setCart(cart.map((item) =>
        item._id === acte._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...acte, quantity: 1 }]);
    }
  }

  function removeActeFromCart(acteId) {
    setCart(cart =>
      cart
        .map((item) => item._id === acteId ? { ...item, quantity: item.quantity - 1 } : item)
        .filter((item) => item.quantity > 0)
    );
  }

  function updateQuantity(acteId, quantity) {
    if (quantity < 1) return;
    setCart(cart =>
      cart.map(item =>
        item._id === acteId ? { ...item, quantity: Number(quantity) } : item
      )
    );
  }

  function generateRandomEmail() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `patient_${timestamp}_${random}@fakeemail.com`;
  }

  async function handleNewPatientSave(patient) {
    if (!patient.email || patient.email.trim() === "") {
      patient.email = generateRandomEmail();
    }

    try {
      const response = await fetch("http://localhost:5095/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Détails de l'erreur :", errorData);
        throw new Error("Erreur lors de l'enregistrement");
      }

      await response.json();

      const patientListResponse = await fetch("http://localhost:5095/api/v1/users");
      const patientListData = await patientListResponse.json();
      setPatients(patientListData?.data?.docs ?? []);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const assuranceTaux = selectedPatient?.status === "Assuré" ? selectedPatient.taux || 0 : 0;
  const totalBrut = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const montantAssurance = (totalBrut * assuranceTaux) / 100;
  const montantPatient = totalBrut - montantAssurance;
  const monnaie = montantDonne ? parseFloat(montantDonne) - montantPatient : 0;

  function handleValiderPaiement() {
    alert(`Paiement validé pour ${selectedPatient?.lastname || "?"} ${selectedPatient?.firstname || ""}`);
    setCart([]);
    setMontantDonne("");
  }

  return (
    <div className="p-6 min-h-screen bg-[#f0fef4]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Caisse Médicale</h1>
        <button
          className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded shadow"
          onClick={() => setShowModal(true)}
        >
          Nouveau patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patients */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-700 mb-4">Patients</h2>
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 border border-green-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-700"
          />
          <div className="overflow-auto max-h-64">
            {filteredPatients.slice(0, 5).map((p) => (
              <div
                key={p._id}
                className={`cursor-pointer p-2 rounded mb-1 ${
                  selectedPatient?._id === p._id
                    ? "bg-green-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedPatient(p)}
              >
                {p.lastname} {p.firstname} ({p.status})
              </div>
            ))}
          </div>
        </div>

        {/* Actes */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Actes médicaux</h2>
          <input
            type="text"
            placeholder="Rechercher un acte..."
            value={acteFilter}
            onChange={(e) => setActeFilter(e.target.value)}
            className="mb-4 border rounded px-3 py-2 w-full"
          />
          <div className="overflow-auto max-h-64">
            {filteredActes.slice(0, 5).map((a) => (
              <div
                key={a._id}
                className="cursor-pointer p-2 mb-1 bg-gray-100 hover:bg-blue-700 rounded"
                onClick={() => addActeToCart(a)}
              >
                {a.typeservice?.name} - {a.departement?.name} - {a.price} F CFA
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panier */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Panier</h2>

        {selectedPatient && (
          <div className="bg-green-50 p-4 border border-green-200 rounded-md mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">Informations du patient</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p><strong>Nom :</strong> {selectedPatient.lastname} {selectedPatient.firstname}</p>
                <p><strong>ID :</strong> {selectedPatient._id}</p>
              </div>
              <div>
                <p><strong>Sexe :</strong> {selectedPatient.sexe}</p>
                <p><strong>Âge :</strong> {selectedPatient.age} ans</p>
              </div>
              <div>
                <p><strong>Téléphone :</strong> {selectedPatient.phone}</p>
                <p><strong>Profession :</strong> {selectedPatient.profession}</p>
              </div>
              <div>
                <p><strong>Statut :</strong> {selectedPatient.status}</p>
                {selectedPatient.status === "Assuré" && (
                  <p><strong>Taux :</strong> {selectedPatient.taux}%</p>
                )}
              </div>
              {selectedPatient.status === "Assuré" && (
                <div>
                  <p><strong>Numéro d’assurance :</strong> {selectedPatient.assurancenumber}</p>
                  <p><strong>Assureur :</strong> {selectedPatient.assurance?.name}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <p className="italic text-gray-500">Aucun acte ajouté</p>
        ) : (
          <>
            <table className="w-full table-auto border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Acte</th>
                  <th className="px-4 py-2 text-right">Quantité</th>
                  <th className="px-4 py-2 text-right">Prix Unitaire</th>
                  <th className="px-4 py-2 text-right">Total</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="px-4 py-2">{item.typeservice?.name}</td>
                    <td className="px-4 py-2 text-right">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, e.target.value)}
                        className="w-16 text-center border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 text-right">{item.price} F CFA</td>
                    <td className="px-4 py-2 text-right">{(item.price * item.quantity).toFixed(2)} F CFA</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => removeActeFromCart(item._id)}
                        className="text-red-600 font-bold hover:text-red-800"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Résumé de paiement */}
            <div className="text-right mb-4 space-y-1">
              <div className="text-sm text-gray-500">
                Total brut : <strong>{totalBrut.toFixed(2)} F CFA</strong>
              </div>
              {assuranceTaux > 0 && (
                <>
                  <div className="text-sm text-blue-600">
                    Pris en charge par l’assurance ({assuranceTaux}%) :{" "}
                    <strong>{montantAssurance.toFixed(2)} F CFA</strong>
                  </div>
                  <div className="text-sm text-green-700 font-semibold">
                    À payer par le patient : <strong>{montantPatient.toFixed(2)} F CFA</strong>
                  </div>
                </>
              )}
              {assuranceTaux === 0 && (
                <div className="text-green-700 font-semibold">
                  À payer : <strong>{montantPatient.toFixed(2)} F CFA</strong>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
              <input
                type="number"
                min="0"
                placeholder="Montant donné"
                value={montantDonne}
                onChange={(e) => setMontantDonne(e.target.value)}
                className="border rounded px-3 py-2 w-48"
              />
              {montantDonne !== "" && monnaie >= 0 && (
                <div className="text-green-700 font-semibold">Monnaie: {monnaie.toFixed(2)} F CFA</div>
              )}
              {montantDonne !== "" && monnaie < 0 && (
                <div className="text-red-700 font-semibold">Manque {Math.abs(monnaie).toFixed(2)} F CFA</div>
              )}
              <button
                disabled={montantDonne === "" || monnaie < 0}
                onClick={handleValiderPaiement}
                className={`px-4 py-2 rounded text-white ${
                  montantDonne === "" || monnaie < 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-800"
                }`}
              >
                Valider le paiement
              </button>
            </div>
          </>
        )}
      </div>

      <NewPatient
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleNewPatientSave}
      />
    </div>
  );
}
