"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type PatientData = { 
  firstname: string ;
  lastname: string;
  phone?: string;
  sexe?: string;
  age?: string;
  profession?: string;
  status?: string;
  assurancenumber?: string;
  taux?: string;
  assurance?: string;
};

type Assurance = {
  _id: string;
  name: string;
  taux: string;
};

type NewPatientProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: PatientData) => void;
};

export default function NewPatient({ isOpen, onClose, onSave }: NewPatientProps) {
  const [assurances, setAssurances] = useState<Assurance[]>([]);
  const [patient, setPatient] = useState<PatientData>({
    firstname: "",
    lastname: "",
    phone: "",
    sexe: 'Masculin',
    age: "",
    profession: "",
    status: 'Non assuré',
    assurancenumber: "",
    taux: "",
    assurance: "",
  });

  useEffect(() => {
    async function fetchAssurances() {
      try {
        const response = await fetch("http://localhost:5095/api/v1/assurances");
        const res = await response.json();
        setAssurances(res?.data?.docs ?? []);
      } catch (error) {
        console.error("Erreur fetch assurances:", error);
        setAssurances([]);
      }
    }
    fetchAssurances();
  }, []);

  useEffect(() => {
    if (patient.status === "Non assuré") {
      setPatient((prev) => ({
        ...prev,
        assurance: "",
        assurancenumber: "",
        taux: "",
      }));
    }
  }, [patient.status]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));

    if (name === "assurance") {
      const selected = assurances.find((a) => a._id === value);
      setPatient((prev) => ({
        ...prev,
        taux: selected ? selected.taux : "",
      }));
    }

  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const patientToSave = { ...patient };

    // Nettoyer les champs assurance si non assuré
    if (patient.status === "Non assuré") {
      delete patientToSave.assurance;
      delete patientToSave.assurancenumber;
      delete patientToSave.taux;
    }

    onSave(patientToSave);

    setPatient({
      firstname: "",
      lastname: "",
      phone: "",
      sexe: "Masculin",
      age: "",
      profession: "",
      status: "Non assuré",
      assurancenumber: "",
      taux: "",
      assurance: "",
    });

    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-white border border-gray-300 rounded-lg max-h-screen overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-center text-black">
              Ajouter un nouveau patient
            </DialogTitle>
            <DialogDescription className="text-center text-gray-700">
              Remplissez les informations ci-dessous pour enregistrer un nouveau patient.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold mb-1 text-black">Nom</label>
                <input
                  type="text"
                  name="lastname"
                  value={patient.lastname}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-black">Prénom</label>
                <input
                  type="text"
                  name="firstname"
                  value={patient.firstname}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block font-semibold mb-1 text-black">Sexe</label>
                <select
                  name="sexe"
                  value={patient.sexe}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-black">Âge</label>
                <input
                  type="number"
                  min="0"
                  name="age"
                  value={patient.age}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-black">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={patient.profession}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
            <div>
                  <label className="block font-semibold mb-1 text-black">Numéro de Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={patient.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-black">Statut</label>
              <select
                name="status"
                value={patient.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="Non assuré">Non assuré</option>
                <option value="Assuré">Assuré</option>
              </select>
            </div>

            {patient.status === "Assuré" && (
              <>
                <div>
                  <label className="block font-semibold mb-1 text-black">Numéro d’assurance</label>
                  <input
                    type="text"
                    name="assurancenumber"
                    value={patient.assurancenumber}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-black">Assureur</label>
                  <select
                    name="assurance"
                    value={patient.assurance}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">-- Choisir une assurance --</option>
                    {assurances.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-black">Taux</label>
                  <input
                    type="text"
                    name="taux"
                    value={patient.taux}
                    readOnly
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-700 hover:bg-green-800 text-white font-semibold"
            >
              Enregistrer
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
