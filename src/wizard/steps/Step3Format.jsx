import React, { useState } from 'react'
import { useDataLoader } from '../../hooks/useDataLoader'
import { useMediaPlan } from '../../context/MediaPlanContext'
import { Card } from '../../components'

export const Step3Format = ({ onValidate }) => {
  const { data: formatsData } = useDataLoader('formats.json')
  const { currentPlan, updateCurrentPlan } = useMediaPlan()
  const [errors, setErrors] = useState({})

  const formats = formatsData?.formats || []
  const selectedSupports = currentPlan.selectedSupports || []

  // Récupérer les formats disponibles pour les supports sélectionnés
  const availableFormats = formats.filter(format =>
    selectedSupports.some(support =>
      format.supportIds.includes(support.supportId)
    )
  )

  const toggleFormat = (supportId, formatId) => {
    const updated = selectedSupports.map(support => {
      if (support.supportId === supportId) {
        return {
          ...support,
          formatId: support.formatId === formatId ? null : formatId
        }
      }
      return support
    })

    updateCurrentPlan({ selectedSupports: updated })
    if (errors[supportId]) {
      const newErrors = { ...errors }
      delete newErrors[supportId]
      setErrors(newErrors)
    }
  }

  const validate = () => {
    const newErrors = {}
    selectedSupports.forEach(support => {
      if (!support.formatId) {
        newErrors[support.supportId] = 'Sélectionnez un format pour ce support'
      }
    })

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onValidate()
    }
    return Object.keys(newErrors).length === 0
  }

  React.useEffect(() => {
    window.wizardValidate = validate
  }, [currentPlan, selectedSupports])

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Pour chaque support, sélectionnez le format qui convient à votre message.
      </p>

      {selectedSupports.map(support => {
        const supportFormats = availableFormats.filter(f =>
          f.supportIds.includes(support.supportId)
        )

        return (
          <div key={support.supportId}>
            <h3 className="font-bold text-gray-900 mb-3">
              Format pour: {formats.find(f => f.supportIds.includes(support.supportId))?.supportIds}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {supportFormats.map(format => (
                <Card
                  key={format.id}
                  className={`cursor-pointer transition-all border-2 p-4 ${
                    support.formatId === format.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                  onClick={() => toggleFormat(support.supportId, format.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{format.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{format.dimensions}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      support.formatId === format.id
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {support.formatId === format.id && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{format.description}</p>
                </Card>
              ))}
            </div>

            {errors[support.supportId] && (
              <p className="text-red-600 text-sm mb-4">{errors[support.supportId]}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
