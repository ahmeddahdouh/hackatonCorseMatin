import React, { useState, useEffect } from 'react';
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
  LineChart,
  Line,
} from 'recharts';
import { 
  loadCorsData, 
  getAudienceTotale, 
  getSocialMediaStats, 
  getWebTrafficStats,
  estimateAudience,
  estimateImpressions,
  calculateCPM
} from '../utils/corsDataLoader';

export const PlanStatsChart = ({ plan }) => {
  const [corsData, setCorsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const data = await loadCorsData();
      setCorsData(data);
      setLoading(false);
    };
    initData();
  }, []);

  if (!plan) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-corse-gris">Aucun plan sélectionné</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-corse-gris">Chargement des données...</p>
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

  // Calculer l'audience réelle basée sur les données Corse Matin
  let estimatedReach = plan.kpis?.estimatedReach || 50000;
  let estimatedImpressionsValue = plan.kpis?.estimatedImpressions || 150000;
  
  // Si les données sont chargées, utiliser les audiences réelles
  if (corsData && corsData.audiences && corsData.audiences.length > 0) {
    // Récupérer les données réelles
    const totalAudience = corsData.audiences.find(a => a.categorie === "Cible Ensemble" && a.modalite === "Total");
    const socialStats = corsData.socialMedia?.find(s => s.mois === "MOYENNE") || {};
    const webStats = corsData.webTraffic?.[0] || {};
    
    // Calculer l'audience basée sur les canaux sélectionnés
    const channels = Object.keys(plan.distribution || {});
    let calculatedAudience = 0;
    
    channels.forEach(channel => {
      const percentage = plan.distribution[channel] || 0;
      const channelBudget = (plan.budget * percentage) / 100;
      
      switch(channel) {
        case 'Print':
          // Audience Corse Matin: 159 000 lecteurs
          const printAudience = totalAudience?.CorseMatin || 159000;
          calculatedAudience += Math.round(printAudience * (channelBudget / 5000) * 0.3);
          break;
        case 'Digital':
          // Trafic web: ~2.7M visites/mois
          const webAudience = webStats.visites_totales || 2746059;
          calculatedAudience += Math.round(webAudience * (channelBudget / 3000) * 0.1);
          break;
        case 'Social':
          // Social: Facebook 265K + Instagram 107K + autres
          const socialAudience = (socialStats.facebook || 265551) + 
                                 (socialStats.instagram || 107225) + 
                                 (socialStats.linkedin || 6450) + 
                                 (socialStats.tiktok || 22664);
          calculatedAudience += Math.round(socialAudience * (channelBudget / 2000) * 0.15);
          break;
        case 'Event':
          calculatedAudience += Math.round(5000 * (channelBudget / 3000));
          break;
        default:
          break;
      }
    });
    
    if (calculatedAudience > 0) {
      estimatedReach = calculatedAudience;
      estimatedImpressionsValue = Math.round(calculatedAudience * 2.5);
    }
  }

  // Données pour un graphique d'évolution
  const performanceData = [
    { week: 'Sem 1', reach: estimatedReach * 0.1, impressions: estimatedImpressionsValue * 0.08 },
    { week: 'Sem 2', reach: estimatedReach * 0.25, impressions: estimatedImpressionsValue * 0.22 },
    { week: 'Sem 3', reach: estimatedReach * 0.55, impressions: estimatedImpressionsValue * 0.50 },
    { week: 'Sem 4', reach: estimatedReach * 0.90, impressions: estimatedImpressionsValue * 0.85 },
    { week: 'Sem 5', reach: estimatedReach, impressions: estimatedImpressionsValue },
  ];

  // Données Social Media pour graphique (si disponibles)
  const socialData = corsData?.socialMedia?.filter(s => s.mois !== "MOYENNE").slice(-6).map(s => ({
    mois: s.mois,
    Facebook: s.facebook || 0,
    Instagram: s.instagram || 0,
    TikTok: s.tiktok || 0,
  })) || [];

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
            {formatNumber(estimatedReach)}
          </p>
          <p className="text-xs text-blue-600 mt-2">Basée sur les données Corse Matin</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
          <p className="text-xs text-green-700 font-semibold uppercase">Impressions Estimées</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {formatNumber(estimatedImpressionsValue)}
          </p>
          <p className="text-xs text-green-600 mt-2">2.5x l'audience</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-500">
          <p className="text-xs text-purple-700 font-semibold uppercase">CPM</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {(plan.budget / (estimatedImpressionsValue / 1000)).toFixed(2)}€
          </p>
          <p className="text-xs text-purple-600 mt-2">Coût par 1000 impressions</p>
        </div>
      </div>

      {/* Graphique 4: Évolution Social Media (si canal Social sélectionné) */}
      {socialData.length > 0 && plan.distribution?.Social > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-corse-noir mb-4">📱 Évolution des Réseaux Sociaux Corse Matin</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={socialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
              <Line type="monotone" dataKey="Facebook" stroke="#1877F2" strokeWidth={2} />
              <Line type="monotone" dataKey="Instagram" stroke="#E4405F" strokeWidth={2} />
              <Line type="monotone" dataKey="TikTok" stroke="#000000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-corse-gris mt-2 text-center">
            Données réelles des abonnés Corse Matin sur les réseaux sociaux
          </p>
        </div>
      )}

      {/* Données sources */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-xs text-corse-gris text-center">
          📊 Calculs basés sur les données officielles Corse Matin : 
          Audience Print 159K | Trafic Web 2.7M/mois | Social 400K+ abonnés
        </p>
      </div>
    </div>
  );
};

