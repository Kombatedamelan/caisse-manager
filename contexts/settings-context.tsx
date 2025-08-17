"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"



const SETTINGS_STORAGE_KEY = "app_settings";
// Types pour les paramètres de l'application
export interface AppSettings {
  id: string
  lastname: string
  firstname: string
  phone: string
  email: string
  profession: string
  password: string
  role: string
}

const defaultSettings: AppSettings = {
  id: "",
  lastname: "",
  firstname: "",
  phone: "",
  email: "",
  profession: "",
  password: "",
  role: "",
}


// Interface du contexte
interface SettingsContextType {
    settings: AppSettings | null ;
    updateSettings: (newSettings: Partial<AppSettings>) => void
    resetSettings: () => void
}

// Création du contexte
const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Hook pour utiliser le contexte 
export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings doit être utilisé à l'intérieur d'un SettingsProvider")
  }
  return context
}

// Provider du contexte
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Charger les paramètres depuis le localStorage au démarrage
  useEffect(() => {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings)
        setSettings({ ...defaultSettings, ...parsedSettings })
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Sauvegarder les paramètres dans le localStorage à chaque modification
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    }
  }, [settings, isLoaded])


  // Mettre à jour les paramètres
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  // Réinitialiser les paramètres
  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>{children}</SettingsContext.Provider>
  )
}
