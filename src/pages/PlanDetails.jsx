import React, { useState } from 'react';
import { ArrowLeft, Download, Trash2, Eye, EyeOff } from 'lucide-react';

export const PlanDetails = ({ plan, onBack, onDelete, onExport }) => {
  const [showChannelDetails, setShowChannelDetails] = useState({});

  // Gestion du cas où le plan est null ou undefined
  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-corse-rouge hover:text-red-700 font-semibold mb-4 transition"
          >
            <ArrowLeft size={20} />
            Retour aux plans
          </button>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-xl text-corse-gris">Aucun plan sélectionné</p>
            <p className="text-corse-gris-light mt-2">Veuillez sélectionner un plan depuis la liste</p>
          </div>
        </div>
      </div>
    );
  }

  const toggleChannelDetails = (channel) => {
    setShowChannelDetails(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getChannelIcon = (channel) => {
    const icons = {
      print: '📰',
      digital: '💻',
      social: '📱',
      event: '🎪'
    };
    return icons[channel] || '📊';
  };

  const getChannelName = (channel) => {
    const names = {
      print: 'Presse',
      digital: 'Numérique',
      social: 'Réseaux Sociaux',
      event: 'Événementiel'
    };
    return names[channel] || channel;
  };

  const getChannelColor = (channel) => {
    const colors = {
      print: 'bg-amber-50 border-amber-200',
      digital: 'bg-blue-50 border-blue-200',
      social: 'bg-purple-50 border-purple-200',
      event: 'bg-green-50 border-green-200'
    };
    return colors[channel] || 'bg-gray-50 border-gray-200';
  };

  const getChannelBorderColor = (channel) => {
    const colors = {
      print: 'border-amber-500',
      digital: 'border-blue-500',
      social: 'border-purple-500',
      event: 'border-green-500'
    };
    return colors[channel] || 'border-gray-500';
  };

  const effectiveDistribution = plan.effectiveDistribution || plan.distribution || {};
  const distribution = plan.customDistribution || effectiveDistribution;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-corse-rouge hover:text-red-700 font-semibold mb-4 transition"
          >
            <ArrowLeft size={20} />
            Retour aux plans
          </button>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-corse-rouge">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-corse-noir">{plan.campaignName || 'Campagne sans nom'}</h1>
                <p className="text-corse-gris-light mt-1">{plan.clientName || 'Client'} - {plan.clientMatricule || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-corse-rouge">{(plan.budget || 0).toLocaleString()}€</p>
                <p className="text-sm text-corse-gris-light mt-1">Créé le {plan.createdAt ? formatDate(plan.createdAt) : 'N/A'}</p>
              </div>
            </div>

            {/* Info générale */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-corse-gris-light uppercase font-semibold">Secteur</p>
                <p className="font-semibold text-corse-noir">{plan.sector || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-xs text-corse-gris-light uppercase font-semibold">Zone</p>
                <p className="font-semibold text-corse-noir">
                  {plan.region === 'corse' ? 'Corse' : plan.region === 'world' ? 'Monde' : 'Non définie'}
                </p>
              </div>
              <div>
                <p className="text-xs text-corse-gris-light uppercase font-semibold">Durée</p>
                <p className="font-semibold text-corse-noir">
                  {plan.campaignDuration || '30 jours'}
                </p>
              </div>
              <div>
                <p className="text-xs text-corse-gris-light uppercase font-semibold">Cibles</p>
                <p className="font-semibold text-corse-noir">
                  {Array.isArray(plan.targets) ? plan.targets.length : 
                   (plan.targets?.ageRanges?.length || 0)} segment(s)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Détails des canaux */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-corse-noir flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Détail de la répartition budgétaire
          </h2>

          {Object.keys(distribution).length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-corse-gris-light">Aucune répartition budgétaire définie</p>
            </div>
          ) : Object.entries(distribution).map(([channel, percentage]) => {
            if (percentage === 0) return null;

            const channelBudget = Math.round(((plan.budget || 0) * percentage) / 100);
            const details = plan.channelDetails?.[channel] || {};
            const offers = details.selectedOffers || [];
            const isExpanded = showChannelDetails[channel];

            return (
              <div key={channel} className={`${getChannelColor(channel)} border-2 ${getChannelBorderColor(channel)} rounded-lg overflow-hidden`}>
                {/* Header du canal */}
                <div
                  onClick={() => toggleChannelDetails(channel)}
                  className="p-6 cursor-pointer hover:bg-opacity-70 transition bg-opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{getChannelIcon(channel)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-corse-noir">
                          {getChannelName(channel)}
                        </h3>
                        <p className="text-sm text-corse-gris-light">
                          {percentage}% du budget
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-corse-rouge">
                        {channelBudget.toLocaleString()}€
                      </p>
                      <div className="flex items-center gap-1 justify-end mt-2 text-corse-gris-light">
                        {isExpanded ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                        <span className="text-xs">
                          {isExpanded ? 'Masquer' : 'Afficher'} détails
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails des offres */}
                {isExpanded && (
                  <div className="bg-white bg-opacity-70 border-t border-current border-opacity-20 p-6">
                    {offers.length > 0 ? (
                      <div className="space-y-4">
                        {offers.map((offer, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-corse-noir text-lg">
                                  {offer.mediaName || offer.name || 'Support'}
                                </h4>
                                <p className="text-sm text-corse-gris-light">
                                  {offer.placement || offer.type || 'Placement'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-corse-rouge">
                                  {(offer.budgetAllocated || offer.budget || 0).toLocaleString()}€
                                </p>
                                <p className="text-xs text-corse-gris-light">
                                  {offer.quantity || 1} × {offer.unitPrice || offer.price || 0}€
                                </p>
                              </div>
                            </div>

                            {/* Specifications */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm pt-3 border-t border-gray-100">
                              {offer.format && (
                                <div>
                                  <span className="text-corse-gris-light text-xs uppercase">Format</span>
                                  <p className="font-semibold text-corse-noir">{offer.format}</p>
                                </div>
                              )}
                              {offer.frequency && (
                                <div>
                                  <span className="text-corse-gris-light text-xs uppercase">Fréquence</span>
                                  <p className="font-semibold text-corse-noir">{offer.frequency}</p>
                                </div>
                              )}
                              {offer.timing && (
                                <div>
                                  <span className="text-corse-gris-light text-xs uppercase">Créneau</span>
                                  <p className="font-semibold text-corse-noir">{offer.timing}</p>
                                </div>
                              )}
                              {offer.circulation && (
                                <div>
                                  <span className="text-corse-gris-light text-xs uppercase">Diffusion</span>
                                  <p className="font-semibold text-corse-noir">{offer.circulation}</p>
                                </div>
                              )}
                              {offer.reach && (
                                <div>
                                  <span className="text-corse-gris-light text-xs uppercase">Portée</span>
                                  <p className="font-semibold text-corse-noir">{offer.reach}</p>
                                </div>
                              )}
                              {offer.impressions && (
                                <div>
                                  <span className="text-corse-gris-light text-xs uppercase">Impressions</span>
                                  <p className="font-semibold text-corse-noir">{(offer.impressions / 1000).toFixed(1)}K</p>
                                </div>
                              )}
                            </div>

                            {/* Notes */}
                            {offer.notes && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-sm text-corse-gris-light italic">
                                  📝 {offer.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-corse-gris-light">
                          Aucun détail d'offre disponible pour ce canal
                        </p>
                      </div>
                    )}

                    {/* Budget summary for channel */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center bg-gradient-to-r from-corse-rouge to-red-600 text-white p-3 rounded-lg">
                        <span className="font-semibold">Budget alloué au {getChannelName(channel).toLowerCase()}</span>
                        <span className="text-lg font-bold">{channelBudget.toLocaleString()}€</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Récapitulatif des Offres Sélectionnées */}
        {plan.offers && plan.offers.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-corse-noir mb-4 flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              Offres Sélectionnées ({plan.offers.length})
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 font-semibold text-corse-noir">Support</th>
                    <th className="p-3 font-semibold text-corse-noir">Placement</th>
                    <th className="p-3 font-semibold text-corse-noir">Canal</th>
                    <th className="p-3 font-semibold text-corse-noir">Format</th>
                    <th className="p-3 font-semibold text-corse-noir text-right">Qté</th>
                    <th className="p-3 font-semibold text-corse-noir text-right">Prix Unit.</th>
                    <th className="p-3 font-semibold text-corse-rouge text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.offers.map((offer, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium text-corse-noir">
                        {offer.mediaName || offer.name || 'Support'}
                      </td>
                      <td className="p-3 text-corse-gris">
                        {offer.placement || offer.type || '-'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          offer.channel === 'print' ? 'bg-amber-100 text-amber-800' :
                          offer.channel === 'digital' ? 'bg-blue-100 text-blue-800' :
                          offer.channel === 'social' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {getChannelName(offer.channel)}
                        </span>
                      </td>
                      <td className="p-3 text-corse-gris text-sm">
                        {offer.format || '-'}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {offer.quantity || 1}
                      </td>
                      <td className="p-3 text-right text-corse-gris">
                        {(offer.unitPrice || 0).toLocaleString()}€
                      </td>
                      <td className="p-3 text-right font-bold text-corse-rouge">
                        {(offer.budgetAllocated || offer.budget || 0).toLocaleString()}€
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gradient-to-r from-corse-rouge to-red-600 text-white">
                    <td colSpan="6" className="p-3 font-bold">
                      Total des offres sélectionnées
                    </td>
                    <td className="p-3 text-right font-bold text-lg">
                      {plan.offers.reduce((sum, o) => sum + (o.budgetAllocated || o.budget || 0), 0).toLocaleString()}€
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* KPIs */}
        {plan.kpis && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-corse-noir mb-4 flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Estimations des KPIs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-600 text-sm font-semibold uppercase">Audience estimée</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {(plan.kpis.estimatedReach || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-600 text-sm font-semibold uppercase">Impressions</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {(plan.kpis.estimatedImpressions || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-purple-600 text-sm font-semibold uppercase">CPM (€ par 1000)</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {parseFloat(plan.kpis.estimatedCPM || 0).toFixed(2)}€
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Objectifs */}
        {plan.objectives && plan.objectives.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-corse-noir mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Objectifs
            </h2>
            <div className="flex flex-wrap gap-2">
              {plan.objectives.map((obj, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-corse-rouge to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                >
                  {obj}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => onExport(plan)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-md"
          >
            <Download size={20} />
            Exporter en JSON
          </button>
          <button
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
                onDelete(plan.id);
              }
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-md"
          >
            <Trash2 size={20} />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};
