import { useState, useEffect } from 'react'

const AGE_GATE_KEY = 'zelya_age_confirmed'

export function useAgeGate() {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Utilise sessionStorage (non persistant entre sessions) pour la maquette
    // TODO en production : remplacer par un système de vérification d'âge certifié ARCOM
    const confirmed = sessionStorage.getItem(AGE_GATE_KEY)
    setIsConfirmed(confirmed === 'true')
    setIsLoading(false)
  }, [])

  const confirm = () => {
    sessionStorage.setItem(AGE_GATE_KEY, 'true')
    setIsConfirmed(true)
  }

  const reject = () => {
    sessionStorage.removeItem(AGE_GATE_KEY)
    // Rediriger vers un site externe neutre
    window.location.href = 'https://www.google.fr'
  }

  return { isConfirmed, isLoading, confirm, reject }
}
