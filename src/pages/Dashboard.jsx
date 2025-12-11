import React from 'react'
import { useMediaPlan } from '../context/MediaPlanContext'
import { Button, Card, CardGrid } from '../components'
import {
  PieChartComponent,
  BarChartComponent,
  LineChartComponent
} from '../components/ChartCard'
import { calculatePlanStats, formatCurrency } from '../utils/calculations'
import { useDataLoader } from '../hooks/useDataLoader'

export const Dashboard = ({ onCreateNew }) => {
  const { savedPlans, deletePlan, loadPlan } = useMediaPlan()
  const { data: pricesData } = useDataLoader('prices.json')
  const { data: audiencesData } = useDataLoader('audiences.json')

  // Agréger les données de tous les plans
  const allOffers = savedPlans.flatMap(plan => plan.offers || [])

  // KPIs globaux
  const totalBudgetAllPlans = savedPlans.reduce((sum, plan) => sum + (plan.totalBudget || 0), 0)
  const totalAudienceAllPlans = savedPlans.reduce((sum, plan) => sum + (plan.totalAudience || 0), 0)
  const totalPlans = savedPlans.length

  // Données pour les graphiques
  const budgetBySupport = Object.values(
    allOffers.reduce((acc, offer) => {
      if (!acc[offer.supportName]) {
        acc[offer.supportName] = { name: offer.supportName, value: 0, count: 0 }
      }
      acc[offer.supportName].value += offer.totalPrice || 0
      acc[offer.supportName].count += 1
      return acc
    }, {})
  )

  const budgetByFormat = Object.values(
    allOffers.reduce((acc, offer) => {
      if (!acc[offer.formatName]) {
        acc[offer.formatName] = { name: offer.formatName, value: 0 }
      }
      acc[offer.formatName].value += offer.totalPrice || 0
      return acc
    }, {})
  )

  const audienceBySupport = Object.values(
    allOffers.reduce((acc, offer) => {
      if (!acc[offer.supportName]) {
        acc[offer.supportName] = { name: offer.supportName, value: 0 }
      }
      acc[offer.supportName].value += offer.reach || 0
      return acc
    }, {})
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📊 Tableau de Bord</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de vos plans média</p>
          </div>
          <Button variant="primary" onClick={onCreateNew}>
            ➕ Nouveau Plan
          </Button>
        </div>

        {/* KPIs */}
        <CardGrid cols={3} className="mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-sm font-medium opacity-90">Budget Total</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(totalBudgetAllPlans)}</p>
            <p className="text-xs opacity-75 mt-1">{totalPlans} plan(s)</p>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-sm font-medium opacity-90">Audience Totale</h3>
            <p className="text-3xl font-bold mt-2">{(totalAudienceAllPlans / 1000000).toFixed(1)}M</p>
            <p className="text-xs opacity-75 mt-1">Personnes atteintes</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <h3 className="text-sm font-medium opacity-90">Plans Créés</h3>
            <p className="text-3xl font-bold mt-2">{totalPlans}</p>
            <p className="text-xs opacity-75 mt-1">Sauvegardés localement</p>
          </Card>
        </CardGrid>

        {/* Graphiques */}
        {allOffers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PieChartComponent
              data={budgetBySupport}
              dataKey="value"
              nameKey="name"
              title="💰 Budget par Support"
            />
            <PieChartComponent
              data={budgetByFormat}
              dataKey="value"
              nameKey="name"
              title="📌 Budget par Format"
            />
            <BarChartComponent
              data={audienceBySupport}
              dataKey="value"
              xKey="name"
              title="👥 Audience par Support"
            />
          </div>
        )}

        {/* Tableau des plans sauvegardés */}
        <Card title="📋 Plans Sauvegardés" className="overflow-x-auto">
          {savedPlans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Aucun plan sauvegardé pour le moment.</p>
              <Button variant="primary" onClick={onCreateNew}>
                Créer le premier plan
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Plan</th>
                  <th className="px-4 py-3 text-left font-semibold">Client</th>
                  <th className="px-4 py-3 text-right font-semibold">Budget</th>
                  <th className="px-4 py-3 text-right font-semibold">Audience</th>
                  <th className="px-4 py-3 text-center font-semibold">Offres</th>
                  <th className="px-4 py-3 text-right font-semibold">Date</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedPlans.map(plan => (
                  <tr key={plan.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{plan.planName}</td>
                    <td className="px-4 py-3">{plan.clientName}</td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      {formatCurrency(plan.totalBudget || 0)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(plan.totalAudience / 1000000).toFixed(2)}M
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        {plan.offers?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600 text-xs">
                      {new Date(plan.updatedAt || plan.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => loadPlan(plan.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                      >
                        ✏️ Éditer
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
                            deletePlan(plan.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-800 font-semibold text-xs"
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  )
}
