import React, { useState } from 'react';
import { savePlanMedia } from '../utils/planStorage';

const Step5Summary = ({ planData = {}, onUpdate, onComplete, onBack }) => {
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const budgetAmount = planData.budget || 25000;
      const estimatedImpressions = Math.round((budgetAmount / 0.5) * 1000);
      
      const plan = {
        campaignName: planData.campaignName || 'Campagne Été 2024',
        sector: planData.sector || 'Tourisme & Loisirs',
        objectives: planData.objectives || ['notoriete', 'trafic-web', 'drive-to-store'],
        budget: budgetAmount,
        distribution: planData.effectiveDistribution || {
          print: 40,
          digital: 30,
          social: 20,
          event: 10
        },
        targets: {
          ageRanges: planData.ageRanges || ['25-34 ans', '35-49 ans', '50-64 ans'],
          gender: planData.gender || 'mixte',
          cspLevels: planData.cspLevels || ['csp+', 'actifs'],
          interests: planData.interests || ['tourisme', 'conso-locale', 'shopping'],
          geographicTargets: planData.geographicTargets || ['Ajaccio', 'Bastia', 'Porto-Vecchio', 'Calvi'],
        },
        kpis: {
          estimatedReach: Math.round((budgetAmount / 0.8) * 1000),
          estimatedImpressions: estimatedImpressions,
          estimatedCPM: (budgetAmount / (estimatedImpressions / 1000)).toFixed(2),
        }
      };
      setGeneratedPlan(plan);
      setLoading(false);
    }, 500);
  }, [planData]);

  const handlePrint = () => {
    window.print();
  };

  const objectiveLabels = {
    'notoriete': '🎯 Notoriété',
    'image': '✨ Image / Branding',
    'drive-to-store': '🛍️ Drive-to-Store',
    'trafic-web': '💻 Trafic Web',
    'lancement': '🚀 Lancement Produit',
    'fidelisation': '❤️ Fidélisation Client',
  };

  const cspLabels = {
    'csp+': 'CSP+',
    'csp-': 'CSP-',
    'actifs': 'Actifs',
    'retraites': 'Retraités',
    'etudiants': 'Étudiants',
  };

  const interestLabels = {
    'conso-locale': 'Consommation locale',
    'immobilier': 'Immobilier',
    'automobile': 'Automobile',
    'sante': 'Santé',
    'tourisme': 'Tourisme',
    'shopping': 'Shopping',
    'finance': 'Finance',
    'tech': 'Technologie',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Génération de votre plan média...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* En-tête avec charte Corse Matin */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 border-t-4 border-red-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-16 bg-gradient-to-b from-gray-700 to-red-600 rounded-full"></div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Résumé du <span className="text-red-600">Plan Média</span></h1>
                <p className="text-gray-600 mt-2">Votre campagne publicitaire en détail</p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="print:hidden bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2 shadow-md"
            >
              🖨️ Imprimer
            </button>
          </div>
        </div>

        {generatedPlan && (
          <div className="space-y-6 print:space-y-4">
            {/* Section Campagne */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-red-600">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <span className="text-gray-800">Informations <span className="text-red-600">Campagne</span></span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-gray-700">
                  <p className="text-gray-600 text-xs uppercase tracking-wider font-bold mb-2">Nom Campagne</p>
                  <p className="text-2xl font-bold text-gray-800">{generatedPlan.campaignName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-red-600">
                  <p className="text-gray-600 text-xs uppercase tracking-wider font-bold mb-2">Secteur d'Activité</p>
                  <p className="text-2xl font-bold text-gray-800">{generatedPlan.sector}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border-l-4 border-red-600">
                  <p className="text-red-600 text-xs uppercase tracking-wider font-bold mb-2">Budget Alloué</p>
                  <p className="text-3xl font-bold text-red-600">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(generatedPlan.budget)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-gray-700">
                  <p className="text-gray-600 text-xs uppercase tracking-wider font-bold mb-2">Date Génération</p>
                  <p className="text-2xl font-bold text-gray-800">{new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>

            {/* Objectifs */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-gray-700">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span className="text-gray-800">Objectifs de <span className="text-red-600">Communication</span></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedPlan.objectives.map(obj => (
                  <div key={obj} className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-600 p-4 rounded-lg hover:shadow-md transition">
                    <p className="font-bold text-gray-800">{objectiveLabels[obj] || obj}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cibles */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-red-600">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <span className="text-gray-800">Cibles <span className="text-red-600">Audience</span></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Âges */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-red-600">▪</span> Tranches d'Âge
                  </p>
                  <div className="space-y-2">
                    {generatedPlan.targets.ageRanges.map(age => (
                      <p key={age} className="text-sm text-gray-700 pl-4">• {age}</p>
                    ))}
                  </div>
                </div>

                {/* Genre */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-red-600">▪</span> Genre
                  </p>
                  <p className="text-sm text-gray-700 pl-4 capitalize">
                    {generatedPlan.targets.gender === 'H' ? 'Hommes' : 
                     generatedPlan.targets.gender === 'F' ? 'Femmes' : 
                     'Mixte (H/F)'}
                  </p>
                </div>

                {/* CSP */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-red-600">▪</span> CSP
                  </p>
                  <div className="space-y-2">
                    {generatedPlan.targets.cspLevels.map(csp => (
                      <p key={csp} className="text-sm text-gray-700 pl-4">• {cspLabels[csp] || csp}</p>
                    ))}
                  </div>
                </div>

                {/* Zones Géographiques */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-red-600">▪</span> Zones Géographiques
                  </p>
                  <div className="space-y-2">
                    {generatedPlan.targets.geographicTargets.map(zone => (
                      <p key={zone} className="text-sm text-gray-700 pl-4">• {zone}</p>
                    ))}
                  </div>
                </div>

                {/* Intérêts */}
                {generatedPlan.targets.interests && generatedPlan.targets.interests.length > 0 && (
                  <div className="md:col-span-2 bg-gray-50 rounded-lg p-5">
                    <p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-red-600">▪</span> Centres d'Intérêt
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {generatedPlan.targets.interests.map(interest => (
                        <span key={interest} className="bg-white border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:border-red-600 transition">
                          {interestLabels[interest] || interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Répartition Budget */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-gray-700">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <span className="text-gray-800">Répartition <span className="text-red-600">Budgétaire</span></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(generatedPlan.distribution).map(([channel, percent]) => {
                  const channelLabels = {
                    print: 'Print',
                    digital: 'Digital',
                    social: 'Réseaux Sociaux',
                    event: 'Événements'
                  };
                  const amount = Math.round((generatedPlan.budget * percent) / 100);
                  return (
                    <div key={channel} className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl text-center border-2 border-gray-200 hover:border-red-600 transition hover:shadow-md">
                      <p className="text-3xl font-bold text-red-600 mb-1">{percent}%</p>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-3">{channelLabels[channel]}</p>
                      <p className="text-sm font-bold text-gray-800">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KPI Estimés */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-8 shadow-xl text-white">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <span>KPI <span className="text-red-600">Estimés</span></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 border-white/20 hover:bg-white/20 transition">
                  <p className="text-sm text-red-500 font-bold uppercase tracking-wider mb-2">Audience Estimée</p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {(generatedPlan.kpis.estimatedReach / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-300 mt-2">contacts uniques</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 border-white/20 hover:bg-white/20 transition">
                  <p className="text-sm text-red-500 font-bold uppercase tracking-wider mb-2">Impressions</p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {(generatedPlan.kpis.estimatedImpressions / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-300 mt-2">affichages totaux</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 border-white/20 hover:bg-white/20 transition">
                  <p className="text-sm text-red-500 font-bold uppercase tracking-wider mb-2">CPM Moyen</p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {typeof generatedPlan.kpis.estimatedCPM === 'string' 
                      ? generatedPlan.kpis.estimatedCPM 
                      : generatedPlan.kpis.estimatedCPM.toFixed(2)}€
                  </p>
                  <p className="text-xs text-gray-300 mt-2">pour 1000 impressions</p>
                </div>
              </div>
            </div>

            {/* Offres Sélectionnées */}
            {planData.channelDetails && Object.values(planData.channelDetails).some(ch => ch?.selectedOffers?.length > 0) && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-red-600">
                <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <span className="text-gray-800">Offres <span className="text-red-600">Sélectionnées</span></span>
                </h3>
                
                {/* Tableau des offres */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left font-bold text-gray-700 border-b-2 border-gray-300">Support</th>
                        <th className="p-3 text-left font-bold text-gray-700 border-b-2 border-gray-300">Placement</th>
                        <th className="p-3 text-left font-bold text-gray-700 border-b-2 border-gray-300">Canal</th>
                        <th className="p-3 text-left font-bold text-gray-700 border-b-2 border-gray-300">Format</th>
                        <th className="p-3 text-right font-bold text-gray-700 border-b-2 border-gray-300">Qté</th>
                        <th className="p-3 text-right font-bold text-gray-700 border-b-2 border-gray-300">Prix Unit.</th>
                        <th className="p-3 text-right font-bold text-red-600 border-b-2 border-gray-300">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(planData.channelDetails).map(([channel, details]) => {
                        const offers = details?.selectedOffers || [];
                        const channelLabels = {
                          print: 'Print',
                          digital: 'Digital',
                          social: 'Social',
                          event: 'Event'
                        };
                        return offers.map((offer, idx) => (
                          <tr key={`${channel}-${idx}`} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-800">
                              {offer.mediaName || offer.name || 'Support'}
                            </td>
                            <td className="p-3 text-gray-600">
                              {offer.placement || offer.type || '-'}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                channel === 'print' ? 'bg-amber-100 text-amber-800' :
                                channel === 'digital' ? 'bg-blue-100 text-blue-800' :
                                channel === 'social' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {channelLabels[channel]}
                              </span>
                            </td>
                            <td className="p-3 text-gray-600 text-sm">
                              {offer.format || '-'}
                            </td>
                            <td className="p-3 text-right font-medium">
                              {offer.quantity || 1}
                            </td>
                            <td className="p-3 text-right text-gray-600">
                              {(offer.unitPrice || 0).toLocaleString()}€
                            </td>
                            <td className="p-3 text-right font-bold text-red-600">
                              {(offer.budgetAllocated || offer.budget || 0).toLocaleString()}€
                            </td>
                          </tr>
                        ));
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-red-600 text-white">
                        <td colSpan="6" className="p-3 font-bold">
                          Total des offres sélectionnées
                        </td>
                        <td className="p-3 text-right font-bold text-lg">
                          {Object.values(planData.channelDetails)
                            .flatMap(ch => ch?.selectedOffers || [])
                            .reduce((sum, o) => sum + (o.budgetAllocated || o.budget || 0), 0)
                            .toLocaleString()}€
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Résumé par canal */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(planData.channelDetails).map(([channel, details]) => {
                    const offers = details?.selectedOffers || [];
                    if (offers.length === 0) return null;
                    const channelLabels = {
                      print: '📰 Print',
                      digital: '💻 Digital',
                      social: '📱 Social',
                      event: '🎪 Event'
                    };
                    const total = offers.reduce((sum, o) => sum + (o.budgetAllocated || o.budget || 0), 0);
                    return (
                      <div key={channel} className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm font-bold text-gray-700">{channelLabels[channel]}</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{offers.length}</p>
                        <p className="text-xs text-gray-500">offre(s)</p>
                        <p className="text-sm font-bold text-gray-800 mt-2">{total.toLocaleString()}€</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommandations */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg border-2 border-red-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <span className="text-gray-800">Recommandations <span className="text-red-600">Stratégiques</span></span>
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <span className="text-red-600 font-bold text-xl">✓</span>
                  <span className="text-gray-700 font-medium">Campagne {generatedPlan.objectives.includes('trafic-web') ? 'fortement orientée Digital' : 'équilibrée'} adaptée à vos objectifs</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-red-600 font-bold text-xl">✓</span>
                  <span className="text-gray-700 font-medium">Budget optimisé pour {generatedPlan.objectives.length} objectif(s) de communication</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-red-600 font-bold text-xl">✓</span>
                  <span className="text-gray-700 font-medium">Ciblage précis sur {generatedPlan.targets.ageRanges.length} tranche(s) d'âge et {generatedPlan.targets.cspLevels.length} CSP</span>
                </li>
              </ul>
            </div>

            {/* Informations Client (pour impression) */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-gray-700">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <span className="text-gray-800">Informations <span className="text-red-600">Client</span></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-xs uppercase tracking-wider font-bold mb-1">Nom Client</p>
                  <p className="text-lg font-bold text-gray-800">{planData.clientName || 'Non renseigné'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-xs uppercase tracking-wider font-bold mb-1">Matricule</p>
                  <p className="text-lg font-bold text-gray-800">{planData.clientMatricule || 'Non renseigné'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-xs uppercase tracking-wider font-bold mb-1">Zone Géographique</p>
                  <p className="text-lg font-bold text-gray-800">{planData.region === 'corse' ? 'Corse' : planData.region === 'world' ? 'Hors Corse' : 'Non définie'}</p>
                </div>
              </div>
            </div>

            {/* Boutons Actions */}
            <div className="flex gap-4 pt-8 print:hidden">
              <button
                type="button"
                onClick={() => onBack && onBack()}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition shadow-md"
              >
                ← Retour Modifier
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-gray-700 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition shadow-md flex items-center justify-center gap-2"
              >
                <span className="text-xl">🖨️</span> Imprimer le Plan
              </button>
              <button
                onClick={() => {
                  try {
                    // Sauvegarder le plan avec les données complètes
                    const planToSave = {
                      ...planData,
                      ...generatedPlan,
                    };
                    savePlanMedia(planToSave);
                    // Appeler le callback pour retourner au dashboard
                    onComplete && onComplete();
                  } catch (error) {
                    console.error('Erreur sauvegarde plan:', error);
                    alert('Erreur lors de la sauvegarde du plan');
                  }
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-xl">✓</span> Finaliser la Campagne
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4 print:hidden">
              💾 Vous pouvez imprimer ou télécharger ce résumé au format PDF
            </p>
          </div>
        )}
      </div>

      {/* Style d'impression */}
      <style>{`
        @media print {
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            width: 100%;
            height: 100%;
            background: white;
            color: #333;
            font-family: Arial, sans-serif;
            line-height: 1.5;
          }
          
          .min-h-screen {
            min-height: auto;
            background: white !important;
            padding: 20pt !important;
          }
          
          button, .print\\:hidden {
            display: none !important;
          }
          
          h1, h2, h3 {
            color: #DC2626;
            margin: 10pt 0 8pt 0;
            font-weight: bold;
          }
          
          h1 { font-size: 18pt; margin-bottom: 15pt; }
          h2 { font-size: 14pt; margin-top: 15pt; }
          h3 { font-size: 12pt; }
          
          .rounded-2xl, .border-2 {
            background: white !important;
            border: 1pt solid #DDD !important;
            margin: 15pt 0;
            padding: 15pt;
            page-break-inside: avoid;
          }
          
          .shadow-lg, .shadow-xl {
            box-shadow: none !important;
          }
          
          .grid {
            display: grid;
            gap: 15pt;
            margin: 10pt 0;
          }
          
          .grid-cols-1 { grid-template-columns: 1fr; }
          .grid-cols-2 { grid-template-columns: 1fr 1fr; }
          .grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
          .grid-cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
          .md\\:grid-cols-2 { grid-template-columns: 1fr 1fr; }
          .md\\:grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
          .md\\:grid-cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
          
          p {
            font-size: 10pt;
            margin: 4pt 0;
            color: #333;
          }
          
          .text-sm { font-size: 9pt; }
          .text-xs { font-size: 8pt; }
          .text-lg { font-size: 11pt; }
          .text-2xl { font-size: 12pt; font-weight: bold; }
          .text-3xl { font-size: 14pt; font-weight: bold; }
          .text-4xl { font-size: 16pt; font-weight: bold; }
          
          .text-red-600, .text-red-500 { color: #DC2626; }
          .text-gray-800 { color: #1F2937; }
          .text-gray-700 { color: #374151; }
          .text-gray-600 { color: #4B5563; }
          
          .font-bold { font-weight: bold; }
          .font-semibold { font-weight: 600; }
          
          .uppercase { text-transform: uppercase; }
          .tracking-wider { letter-spacing: 0.5pt; }
          
          .border-l-4 {
            border-left: 3pt solid #DC2626;
            padding-left: 10pt;
          }
          
          .bg-white { background: white; }
          .bg-gray-50 { background: #F9FAFB !important; }
          .bg-red-50 { background: #FEF2F2 !important; }
          
          .p-5, .p-6 { padding: 15pt; }
          .p-8 { padding: 20pt; }
          .mb-2 { margin-bottom: 4pt; }
          .mb-3 { margin-bottom: 6pt; }
          .mb-4 { margin-bottom: 8pt; }
          .mb-5, .mb-6 { margin-bottom: 12pt; }
          .mt-2 { margin-top: 4pt; }
          .gap-2 { gap: 6pt; }
          .gap-3 { gap: 8pt; }
          .gap-4 { gap: 10pt; }
          .gap-5, .gap-6 { gap: 12pt; }
          
          .flex {
            display: flex;
          }
          
          .flex-wrap {
            flex-wrap: wrap;
          }
          
          .items-center {
            align-items: center;
          }
          
          .items-start {
            align-items: flex-start;
          }
          
          @page {
            size: A4;
            margin: 15mm;
          }
          
          h2, h3, .rounded-2xl {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default Step5Summary;