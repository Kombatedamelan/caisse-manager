"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from "../contexts/settings-context"; 

export default function LoginPage() {
  const router = useRouter();
  const { updateSettings } = useSettings();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. appel POST /login
      const res = await fetch("http://localhost:5095/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setLoading(false);
        throw new Error(err.message || "Identifiants incorrects"); 
      }
      const loginData = await res.json();
      console.log("Login response:", loginData);


      const token = loginData.data.token.access;

      if (!token) throw new Error("Token manquant dans la réponse de login");
      // 2. Stockage du token
      localStorage.setItem("token", token);

      const refreshToken = loginData.data.token.refresh;
      localStorage.setItem("refreshToken", refreshToken);



      // 3. Récupérer les infos utilisateur
      const meRes = await fetch("http://localhost:5095/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!meRes.ok) throw new Error("Impossible de récupérer les infos utilisateur");

      const user = await meRes.json();
      console.log("Utilisateur connecté", user);

      const userData = user.data ;

      // 4. Mettre à jour le contexte
      updateSettings({
        id: userData._id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        phone: userData.phone,
        email: userData.email,
        profession: userData.profession,
        password: "", // jamais stocker le mot de passe
        role: userData.role,
      });

      // 5. Redirection
      router.push("/dashboard");

    } catch (err: any) {
      setError(err.message);
    } 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
        <div className="text-center animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-800">Connexion</h2>
          <p className="mt-2 text-sm text-gray-500">Bienvenue dans la gestion de caisse hospitalière</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Champ Nom d'utilisateur */}
          <div className="animate-fadeIn animation-delay-100">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              name="email"
              type="email"
              value={formData.email}
              placeholder="Entrez votre nom d'utilisateur"
              required
              onChange={handleChange}
              aria-required="true"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 placeholder:text-gray-400 transition-all duration-200 ease-in-out hover:border-green-400"
            />

          </div>

          {/* Champ Mot de passe */}
          <div className="animate-fadeIn animation-delay-200">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              placeholder="Entrez votre mot de passe"
              required
              onChange={handleChange}
              aria-required="true"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 placeholder:text-gray-400 transition-all duration-200 ease-in-out hover:border-green-400"
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="text-red-500 text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-400 animate-fadeIn animation-delay-300">
          © {new Date().getFullYear()} - Gestion Caisse Hospitalière
        </div>
      </div>
    </div>
  );
}