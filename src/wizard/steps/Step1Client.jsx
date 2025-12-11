import React, { useState } from 'react'
import { FormField } from '../../components'
import { useMediaPlan } from '../../context/MediaPlanContext'

export const Step1Client = ({ onValidate }) => {
  const { currentPlan, updateCurrentPlan } = useMediaPlan()
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    updateCurrentPlan({
      [name]: value,
    })
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!currentPlan.clientName?.trim()) newErrors.clientName = 'Le nom du client est requis'
    if (!currentPlan.clientType?.trim()) newErrors.clientType = 'Le type de client est requis'

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onValidate()
    }
    return Object.keys(newErrors).length === 0
  }

  React.useEffect(() => {
    window.wizardValidate = validate
  }, [currentPlan])

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Commençons par identifier votre client et définir ses caractéristiques principales.
      </p>

      <FormField
        label="Nom du client"
        name="clientName"
        value={currentPlan.clientName || ''}
        onChange={handleChange}
        placeholder="Ex: Société X, Marque Y"
        error={errors.clientName}
        required
      />

      <FormField
        label="Type de client"
        name="clientType"
        type="select"
        value={currentPlan.clientType || ''}
        onChange={handleChange}
        error={errors.clientType}
        required
      >
        <option value="">-- Sélectionner --</option>
        <option value="B2C">B2C (Consommateurs)</option>
        <option value="B2B">B2B (Entreprises)</option>
        <option value="Autre">Autre</option>
      </FormField>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>ℹ️ Astuce:</strong> Ces informations seront utilisées pour personnaliser vos recommandations.
        </p>
      </div>
    </div>
  )
}
