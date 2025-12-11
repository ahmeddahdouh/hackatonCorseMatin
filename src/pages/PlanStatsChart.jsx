import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export const PlanStatsChart = ({ plan }) => {
  if (!plan) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-corse-gris">Aucun plan sélectionné</p>
      </div>
    );
  }

  // Données pour le graphique de répartition du budget
  const budgetData = plan.distribution 
    ? Object.entries(plan.distribution).map(([channel, percentage]) => ({
        name: channel,
        value: percentage,
        budget: Math.round((plan.budget * percentage) / 100),
      }))
    : [];

  // Couleurs pour les canaux
  const channelColors = {
    Print: '#E60000',
    Digital: '#3B82F6',
    Social: '#A855F7',
    Event: '#10B981',
  };

  // Données pour un graphique d'évolution (simulé)
  const performanceData = [
    { week: 'Sem 1', reach: (plan.kpis?.estimatedReach || 50000) * 0.1, impressions: (plan.kpis?.estimatedImpressions || 150000) * 0.08 },
    { week: 'Sem 2', reach: (plan.kpis?.estimatedReach || 50000) * 0.25, impressions: (plan.kpis?.estimatedImpressions || 150000) * 0.22 },
    { week: 'Sem 3', reach: (plan.kpis?.estimatedReach || 50000) * 0.55, impressions: (plan.kpis?.estimatedImpressions || 150000) * 0.50 },
    { week: 'Sem 4', reach: (plan.kpis?.estimatedReach || 50000) * 0.90, impressions: (plan.kpis?.estimatedImpressions || 150000) * 0.85 },
    { week: 'Sem 5', reach: plan.kpis?.estimatedReach || 50000, impressions: plan.kpis?.estimatedImpressions || 150000 },
  ];

  // Données pour les offres par canal
  const offersPerChannel = {};
  if (plan.channelDetails) {
    Object.entries(plan.channelDetails).forEach(([channel, details]) => {
      offersPerChannel[channel] = (details.selectedOffers || []).length;
    });
  }

  const offersData = Object.entries(offersPerChannel).map(([channel, count]) => ({
    name: channel,
    offers: count,
  }));

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Graphique 1: Répartition du Budget */}
      {budgetData.length > 0 ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-corse-noir mb-4">📊 Répartition du Budget par Canal</h3>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {budgetData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={channelColors[entry.name] || '#999'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {budgetData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: channelColors[item.name] || '#999' }}
                  ></div>
                  <span className="text-sm text-corse-noir">
                    {item.name}: <strong>{item.budget.toLocaleString()}€</strong> ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Graphique 2: Évolution des KPIs */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-corse-noir mb-4">📈 Évolution Estimée de la Campagne</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => formatNumber(value)} />
            <Legend />
            <Area
              type="monotone"
              dataKey="reach"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorReach)"
              name="Audience"
            />
            <Area
              type="monotone"
              dataKey="impressions"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorImpressions)"
              name="Impressions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique 3: Nombre d'offres par canal */}
      {offersData.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-corse-noir mb-4">🎯 Nombre d'Offres par Canal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={offersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="offers" fill="#E60000" name="Offres">
                {offersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={channelColors[entry.name] || '#999'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
          <p className="text-xs text-blue-700 font-semibold uppercase">Audience Estimée</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            {formatNumber(plan.kpis?.estimatedReach || 50000)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
          <p className="text-xs text-green-700 font-semibold uppercase">Impressions Estimées</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {formatNumber(plan.kpis?.estimatedImpressions || 150000)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-500">
          <p className="text-xs text-purple-700 font-semibold uppercase">CPM</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {plan.kpis?.estimatedCPM || 10}€
          </p>
        </div>
      </div>
    </div>
  );
};
