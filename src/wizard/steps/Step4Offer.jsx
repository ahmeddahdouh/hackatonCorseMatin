import React, { useState } from 'react'
import { useDataLoader } from '../../hooks/useDataLoader'
import { useMediaPlan } from '../../context/MediaPlanContext'
import { FormField } from '../../components'
import { calculatePrice } from '../../utils/calculations'

export const Step4Offer = ({ onValidate }) => {
  const { data: pricesData } = useDataLoader('prices.json')
  const { data: supportsData } = useDataLoader('supports.json')
  const { data: formatsData } = useDataLoader('formats.json')
  const { currentPlan, updateCurrentPlan } = useMediaPlan()
  const [errors, setErrors] = useState({})

  const prices = pricesData?.prices || []
  const supports = supportsData?.supports || []
  const formats = formatsData?.formats || []
  const selectedSupports = currentPlan.selectedSupports || []

  const handleQuantityChange = (supportId, value) => {
    const updated = selectedSupports.map(support => {
      if (support.supportId === supportId) {
        return { ...support, quantity: parseInt(value) || 1 }
      }
      return support
    })

    updateCurrentPlan({ selectedSupports: updated })
  }

  const calculateOfferPrice = (supportId, formatId, quantity) => {
    const price = prices.find(p => p.supportId === supportId && p.formatId === formatId)
    return price ? calculatePrice(price, quantity) : 0
  }

  const validate = () => {
    const newErrors = {}
    selectedSupports.forEach(support => {
      if (!support.quantity || support.quantity < 1) {
        newErrors[support.supportId] = 'La quantité doit être >= 1'
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

  const totalBudget = selectedSupports.reduce((sum, support) => {
    if (!support.formatId) return sum
    const price = calculateOfferPrice(support.supportId, support.formatId, support.quantity || 1)
    return sum + price
  }, 0)

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Définissez les quantités pour chaque support et format sélectionnés.
      </p>

      <div className="space-y-4">
        {selectedSupports.map(support => {
          const supportData = supports.find(s => s.id === support.supportId)
          const formatData = formats.find(f => f.id === support.formatId)
          const offerPrice = calculateOfferPrice(support.supportId, support.formatId, support.quantity || 1)
          const priceObj = prices.find(p => p.supportId === support.supportId && p.formatId === support.formatId)

          return (
            <div key={support.supportId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{supportData?.name}</h3>
                  <p className="text-sm text-gray-600">{formatData?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{offerPrice.toLocaleString('fr-FR')} €</p>
                  <p className="text-xs text-gray-600">{priceObj?.unit} @ {priceObj?.pricePerUnit}€</p>
                </div>
              </div>

              <FormField
                label={`Quantité (${priceObj?.unit})`}
                type="number"
                value={support.quantity || 1}
                onChange={(e) => handleQuantityChange(support.supportId, e.target.value)}
                min="1"
                error={errors[support.supportId]}
              />
            </div>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-blue-900"><strong>Budget total estimé:</strong></p>
          <p className="text-2xl font-bold text-blue-600">{totalBudget.toLocaleString('fr-FR')} €</p>
        </div>
      </div>
    </div>
  )
}
