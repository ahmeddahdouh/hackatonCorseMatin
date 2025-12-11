import React, { useState } from 'react';
import { Card, Button } from '../../components';
import { exportPlanToPDF } from '../../utils/pdfExporter';
import { ChartCard } from '../../components';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Étape 4: Aperçu & Export PDF
 * Affichage du plan avec graphiques et export PDF
 */
export default function Step4ReportPDF({ plan, onUpdate, onNext }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const generatedPlan = plan.generatedPlan;

  if (!generatedPlan) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur: Plan non disponible</p>
      </div>
    );
  }

  // Préparation des données graphiques
  const supportData = generatedPlan.offers.map(offer => ({
    name: offer.supportName,
    value: Math.round(offer.totalPrice)
  }));

  const budgetByCategory = [
    { name: 'Print', value: Math.round(generatedPlan.distribution.print) },
    { name: 'Digital', value: Math.round(generatedPlan.distribution.digital) },
  ].filter(item => item.value > 0);

  const reachData = generatedPlan.offers.map(offer => ({
    name: offer.supportName.substring(0, 10),
    reach: Math.round(offer.reach / 1000),
    impressions: Math.round(offer.impressions / 1000)
  }));

  const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#8BC34A', '#E91E63'];

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const fileName = await exportPlanToPDF(
        generatedPlan,
        plan.targetAudience || { age: plan.targetAge, csp: plan.targetCSP, region: plan.region },
        plan.objectives || []
      );
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export du PDF');
    }
    setIsExporting(false);
  };

  const handleFinish = () => {
    onUpdate({ planName: `Plan_${new Date().toISOString().split('T')[0]}` });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* RÉSUMÉ EXÉCUTIF */}
      <Card title="📋 Résumé du Plan">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <p className="text-xs font-semibold text-blue-600 uppercase">Budget</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(generatedPlan.kpis.budgetUtilise)}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <p className="text-xs font-semibold text-green-600 uppercase">Audience</p>
            <p className="text-2xl font-bold text-green-900 mt-2">
              {(generatedPlan.kpis.reachTotal / 1000).toFixed(0)}K
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <p className="text-xs font-semibold text-purple-600 uppercase">Impressions</p>
            <p className="text-2xl font-bold text-purple-900 mt-2">
              {(generatedPlan.kpis.impressionsTotal / 1000).toFixed(0)}K
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
            <p className="text-xs font-semibold text-orange-600 uppercase">CPM Moyen</p>
            <p className="text-2xl font-bold text-orange-900 mt-2">
              {generatedPlan.kpis.cpmMoyen.toFixed(2)}€
            </p>
          </div>
        </div>
      </Card>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie Chart - Budget par support */}
        <Card title="💰 Budget par Support">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={supportData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {supportData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart - Print vs Digital */}
        <Card title="📊 Print vs Digital">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${((value / generatedPlan.totalBudget) * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {budgetByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#FF9800' : '#2196F3'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart - Reach et Impressions */}
        <Card title="📈 Reach & Impressions par Support" className="md:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reachData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reach" fill="#4CAF50" name="Reach (K)" />
              <Bar dataKey="impressions" fill="#2196F3" name="Impressions (K)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* DÉTAIL OFFRES */}
      <Card title="📋 Détail des Offres">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left p-2">Support</th>
                <th className="text-left p-2">Format</th>
                <th className="text-center p-2">Qty</th>
                <th className="text-right p-2">Reach</th>
                <th className="text-right p-2">Impressions</th>
                <th className="text-right p-2">Prix</th>
              </tr>
            </thead>
            <tbody>
              {generatedPlan.offers.map((offer, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2 font-semibold">{offer.supportName}</td>
                  <td className="p-2">{offer.formatName}</td>
                  <td className="text-center p-2">{offer.quantity}</td>
                  <td className="text-right p-2">{(offer.reach / 1000).toFixed(0)}K</td>
                  <td className="text-right p-2">{(offer.impressions / 1000).toFixed(0)}K</td>
                  <td className="text-right p-2 font-semibold text-blue-600">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(offer.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 border-t-2 border-gray-300 font-bold">
                <td className="p-2" colSpan="5">TOTAL</td>
                <td className="text-right p-2 text-blue-600">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(generatedPlan.kpis.budgetUtilise)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* ACTIONS */}
      <Card title="📥 Actions">
        <div className="space-y-3">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              isExporting
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Génération en cours...
              </>
            ) : exported ? (
              <>✅ PDF téléchargé!</>
            ) : (
              <>📄 Télécharger en PDF</>
            )}
          </button>

          <button
            onClick={handleFinish}
            className="w-full px-4 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-all"
          >
            ✓ Terminer & Sauvegarder
          </button>
        </div>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button variant="secondary" onClick={() => window.history.back()} className="w-full">
          ← Retour
        </Button>
      </div>
    </div>
  );
}
