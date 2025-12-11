import React, { createContext, useState, useCallback, useEffect } from 'react'

export const MediaPlanContext = createContext()

// Interface du plan média
export const createEmptyMediaPlan = () => ({
  id: null,
  clientName: '',
  clientType: '',
  selectedSupports: [], // Array of { supportId, formatId, quantity, startDate, endDate }
  offers: [], // Array avec calculs de prix et audience
  totalBudget: 0,
  totalAudience: 0,
  createdAt: null,
  updatedAt: null,
})

export const MediaPlanProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState(createEmptyMediaPlan())
  const [savedPlans, setSavedPlans] = useState([])
  const [currentStep, setCurrentStep] = useState(0)

  // Charger les plans sauvegardés au montage
  useEffect(() => {
    const stored = localStorage.getItem('mediaplans')
    if (stored) {
      try {
        setSavedPlans(JSON.parse(stored))
      } catch (e) {
        console.error('Erreur chargement plans', e)
      }
    }
  }, [])

  // Sauvegarder les plans en localStorage
  const savePlan = useCallback((plan) => {
    const planToSave = {
      ...plan,
      id: plan.id || Date.now().toString(),
      updatedAt: new Date().toISOString(),
    }

    const updated = savedPlans.map(p => p.id === planToSave.id ? planToSave : p)
    if (!updated.some(p => p.id === planToSave.id)) {
      updated.push(planToSave)
    }

    setSavedPlans(updated)
    localStorage.setItem('mediaplans', JSON.stringify(updated))
    return planToSave
  }, [savedPlans])

  // Mettre à jour le plan courant
  const updateCurrentPlan = useCallback((updates) => {
    setCurrentPlan(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  // Ajouter une offre au plan
  const addOfferToCurrentPlan = useCallback((offer) => {
    setCurrentPlan(prev => ({
      ...prev,
      offers: [...prev.offers, offer],
      totalBudget: prev.totalBudget + (offer.totalPrice || 0),
      totalAudience: prev.totalAudience + (offer.audience || 0),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  // Supprimer une offre
  const removeOfferFromCurrentPlan = useCallback((index) => {
    setCurrentPlan(prev => {
      const offer = prev.offers[index]
      return {
        ...prev,
        offers: prev.offers.filter((_, i) => i !== index),
        totalBudget: prev.totalBudget - (offer.totalPrice || 0),
        totalAudience: prev.totalAudience - (offer.audience || 0),
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  // Charger un plan sauvegardé
  const loadPlan = useCallback((planId) => {
    const plan = savedPlans.find(p => p.id === planId)
    if (plan) {
      setCurrentPlan(plan)
    }
  }, [savedPlans])

  // Supprimer un plan sauvegardé
  const deletePlan = useCallback((planId) => {
    const updated = savedPlans.filter(p => p.id !== planId)
    setSavedPlans(updated)
    localStorage.setItem('mediaplans', JSON.stringify(updated))
  }, [savedPlans])

  // Réinitialiser le plan courant
  const resetCurrentPlan = useCallback(() => {
    setCurrentPlan(createEmptyMediaPlan())
    setCurrentStep(0)
  }, [])

  const value = {
    currentPlan,
    savedPlans,
    currentStep,
    setCurrentStep,
    updateCurrentPlan,
    addOfferToCurrentPlan,
    removeOfferFromCurrentPlan,
    savePlan,
    loadPlan,
    deletePlan,
    resetCurrentPlan,
  }

  return (
    <MediaPlanContext.Provider value={value}>
      {children}
    </MediaPlanContext.Provider>
  )
}

export const useMediaPlan = () => {
  const context = React.useContext(MediaPlanContext)
  if (!context) {
    throw new Error('useMediaPlan must be used within MediaPlanProvider')
  }
  return context
}
