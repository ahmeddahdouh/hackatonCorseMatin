import React, { useState } from 'react'
import { useMediaPlan } from '../../context/MediaPlanContext'
import { FormField, Card } from '../../components'

export const Step6Validation = ({ onValidate }) => {
  const { currentPlan, savePlan, resetCurrentPlan } = useMediaPlan()
  const [planName, setPlanName] = useState('')
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const handleNameChange = (e) => {
    setPlanName(e.target.value)
    if (errors.planName) {
      setErrors(prev => ({ ...prev, planName: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!planName.trim()) {
      newErrors.planName = 'Le nom du plan est requis'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      // Sauvegarder le plan
      const planToSave = {
        ...currentPlan,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        planName: planName,
      }
      savePlan(planToSave)
      setSaved(true)
      setTimeout(() => {
        resetCurrentPlan()
        onValidate()
      }, 1500)
    }
    return Object.keys(newErrors).length === 0
  }

  React.useEffect(() => {
    window.wizardValidate = validate
  }, [planName, currentPlan])

  if (saved) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan sauvegardé!</h2>
        <p className="text-gray-600">Votre plan média "{planName}" a été enregistré avec succès.</p>
      </div>
    )
  }

  const totalBudget = currentPlan.totalBudget || 0
  const totalOffers = currentPlan.offers?.length || 0

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Récapitulatif final et sauvegarde de votre plan média.
      </p>

      {/* Récapitulatif */}
      <Card title="📋 Récapitulatif du plan" className="bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Client:</span>
            <span className="font-semibold">{currentPlan.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Type:</span>
            <span className="font-semibold">{currentPlan.clientType}</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="text-gray-700">Nombre d'offres:</span>
            <span className="font-semibold">{totalOffers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Budget total:</span>
            <span className="font-bold text-blue-600 text-lg">{totalBudget.toLocaleString('fr-FR')}€</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Portée totale:</span>
            <span className="font-semibold">{(currentPlan.totalAudience / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </Card>

      {/* Formulaire de sauvegarde */}
      <FormField
        label="Nom du plan média"
        value={planName}
        onChange={handleNameChange}
        placeholder="Ex: Campagne Automne 2024"
        error={errors.planName}
        required
      />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <strong>⚠️ Important:</strong> Une fois validé, le plan sera sauvegardé localement dans votre navigateur.
        </p>
      </div>
    </div>
  )
}
