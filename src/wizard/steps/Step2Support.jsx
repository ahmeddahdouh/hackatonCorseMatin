import React, { useState } from 'react'
import { useDataLoader } from '../../hooks/useDataLoader'
import { useMediaPlan } from '../../context/MediaPlanContext'
import { Card } from '../../components'

export const Step2Support = ({ onValidate }) => {
  const { data: supportsData } = useDataLoader('supports.json')
  const { currentPlan, updateCurrentPlan } = useMediaPlan()
  const [errors, setErrors] = useState({})

  const supports = supportsData?.supports || []

  const toggleSupport = (supportId) => {
    const selectedSupports = currentPlan.selectedSupports || []
    const isSelected = selectedSupports.some(s => s.supportId === supportId)
    
    let updated
    if (isSelected) {
      updated = selectedSupports.filter(s => s.supportId !== supportId)
    } else {
      updated = [...selectedSupports, { supportId, formatId: null, quantity: 1 }]
    }

    updateCurrentPlan({ selectedSupports: updated })
    if (errors.supports) {
      setErrors(prev => ({ ...prev, supports: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    const selectedSupports = currentPlan.selectedSupports || []
    
    if (selectedSupports.length === 0) {
      newErrors.supports = 'Sélectionnez au moins un support'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onValidate()
    }
    return Object.keys(newErrors).length === 0
  }

  React.useEffect(() => {
    window.wizardValidate = validate
  }, [currentPlan])

  const selectedSupports = currentPlan.selectedSupports || []

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Sélectionnez les supports média où vous souhaitez apparaître.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supports.map(support => (
          <Card
            key={support.id}
            className={`cursor-pointer transition-all border-2 ${
              selectedSupports.some(s => s.supportId === support.id)
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-400'
            }`}
            onClick={() => toggleSupport(support.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{support.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{support.name}</h3>
                    <p className="text-sm text-gray-600">{support.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">{support.description}</p>
              </div>
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                selectedSupports.some(s => s.supportId === support.id)
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedSupports.some(s => s.supportId === support.id) && (
                  <span className="text-white text-sm">✓</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {errors.supports && (
        <p className="text-red-600 text-sm">{errors.supports}</p>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-900">
          <strong>✓ Sélection:</strong> {selectedSupports.length} support(s) choisi(s)
        </p>
      </div>
    </div>
  )
}
