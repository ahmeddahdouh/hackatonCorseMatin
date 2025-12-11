import React, { useState } from 'react'
import { useDataLoader } from '../../hooks/useDataLoader'
import { useMediaPlan } from '../../context/MediaPlanContext'
import { Card } from '../../components'
import {
  BarChartComponent,
  PieChartComponent
} from '../../components/ChartCard'
import { calculatePrice, calculateAudience } from '../../utils/calculations'

export const Step5Preview = ({ onValidate }) => {
  const { data: pricesData } = useDataLoader('prices.json')
  const { data: audiencesData } = useDataLoader('audiences.json')
  const { data: supportsData } = useDataLoader('supports.json')
  const { data: formatsData } = useDataLoader('formats.json')
  const { currentPlan, updateCurrentPlan } = useMediaPlan()

  const prices = pricesData?.prices || []
  const audiences = audiencesData?.audiences || []
  const supports = supportsData?.supports || []
  const formats = formatsData?.formats || []
  const selectedSupports = currentPlan.selectedSupports || []

  // Construire les offres détaillées
  const detailedOffers = selectedSupports
    .filter(s => s.formatId)
    .map(support => {
      const supportData = supports.find(s => s.id === support.supportId)
      const formatData = formats.find(f => f.id === support.formatId)
      const priceObj = prices.find(p => p.supportId === support.supportId && p.formatId === support.formatId)
      const audienceObj = audiences.find(a => a.supportId === support.supportId && a.formatId === support.formatId)

      const totalPrice = priceObj ? calculatePrice(priceObj, support.quantity || 1) : 0
      const reach = audienceObj ? calculateAudience(audienceObj, support.quantity || 1) : 0

      return {
        supportId: support.supportId,
        formatId: support.formatId,
        supportName: supportData?.name || 'Unknown',
        formatName: formatData?.name || 'Unknown',
        quantity: support.quantity || 1,
        totalPrice,
        reach,
        impressions: audienceObj?.monthlyImpressions * (support.quantity || 1) || 0,
      }
    })

  // Sauvegarder les offres
  React.useEffect(() => {
    if (detailedOffers.length > 0) {
      updateCurrentPlan({
        offers: detailedOffers,
        totalBudget: detailedOffers.reduce((sum, o) => sum + o.totalPrice, 0),
        totalAudience: detailedOffers.reduce((sum, o) => sum + o.reach, 0),
      })
    }
  }, [selectedSupports])

  const validate = () => {
    onValidate()
    return true
  }

  React.useEffect(() => {
    window.wizardValidate = validate
  }, [])

  // Données pour les graphiques
  const budgetBySupport = Object.values(
    detailedOffers.reduce((acc, offer) => {
      if (!acc[offer.supportName]) {
        acc[offer.supportName] = { name: offer.supportName, value: 0 }
      }
      acc[offer.supportName].value += offer.totalPrice
      return acc
    }, {})
  )

  const budgetByFormat = Object.values(
    detailedOffers.reduce((acc, offer) => {
      if (!acc[offer.formatName]) {
        acc[offer.formatName] = { name: offer.formatName, value: 0 }
      }
      acc[offer.formatName].value += offer.totalPrice
      return acc
    }, {})
  )

  const totalBudget = detailedOffers.reduce((sum, o) => sum + o.totalPrice, 0)
  const totalReach = detailedOffers.reduce((sum, o) => sum + o.reach, 0)
  const totalImpressions = detailedOffers.reduce((sum, o) => sum + o.impressions, 0)

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Voici l'aperçu complet de votre plan média avec les analyses visuelles.
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-sm font-medium opacity-90">Budget Total</h3>
          <p className="text-3xl font-bold mt-2">{totalBudget.toLocaleString('fr-FR')}€</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-sm font-medium opacity-90">Portée Totale</h3>
          <p className="text-3xl font-bold mt-2">{(totalReach / 1000000).toFixed(1)}M</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 className="text-sm font-medium opacity-90">Impressions</h3>
          <p className="text-3xl font-bold mt-2">{(totalImpressions / 1000000).toFixed(1)}M</p>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent
          data={budgetBySupport}
          dataKey="value"
          nameKey="name"
          title="Répartition Budget par Support"
        />
        <PieChartComponent
          data={budgetByFormat}
          dataKey="value"
          nameKey="name"
          title="Répartition Budget par Format"
        />
      </div>

      {/* Tableau des offres */}
      <Card title="Détail des offres" className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Support</th>
              <th className="px-3 py-2 text-left font-semibold">Format</th>
              <th className="px-3 py-2 text-right font-semibold">Quantité</th>
              <th className="px-3 py-2 text-right font-semibold">Budget</th>
              <th className="px-3 py-2 text-right font-semibold">Reach</th>
            </tr>
          </thead>
          <tbody>
            {detailedOffers.map((offer, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">{offer.supportName}</td>
                <td className="px-3 py-2">{offer.formatName}</td>
                <td className="px-3 py-2 text-right">{offer.quantity}</td>
                <td className="px-3 py-2 text-right font-semibold">{offer.totalPrice.toLocaleString('fr-FR')}€</td>
                <td className="px-3 py-2 text-right">{(offer.reach / 1000000).toFixed(2)}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
