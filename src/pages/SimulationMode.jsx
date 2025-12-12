/**
 * SimulationMode.jsx
 * Mode 2 : Simulation KPI Prévisionnels
 * Interface principale avec catalogue, panier et calculateur financier
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Plus, Minus, Trash2, ShoppingCart, Calculator,
  Users, Target, Percent, Euro, FileText, Sparkles,
  Newspaper, Monitor, Share2, Package, Filter,
  ChevronDown, AlertCircle, Loader2
} from 'lucide-react';
import ResultView from './ResultView';

// Configuration API
const API_BASE_URL = 'http://localhost:8000';

// Mapping des icônes Lucide
const IconMap = {
  Newspaper, Monitor, Share2, Package,
  Star: Sparkles,
  FileText, BookOpen: FileText,
  LayoutTop: Monitor,
  Square: Monitor,
  Maximize: Monitor,
  FileEdit: FileText,
  Play: Monitor,
  Mail: FileText,
  Facebook: Share2,
  Camera: Share2,
  Instagram: Share2,
  Sparkles, Film: Monitor,
  Video: Monitor,
  Linkedin: Share2,
  Layers: Package,
  PlayCircle: Monitor,
  Award: Sparkles,
  Calendar: FileText,
};

// Couleurs par catégorie
const CATEGORY_COLORS = {
  PRINT: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', accent: '#b91c1c' },
  DIGITAL: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', accent: '#1e40af' },
  SOCIAL: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', accent: '#7c3aed' },
  PACK: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', accent: '#d97706' },
};

const SimulationMode = () => {
  // État du catalogue
  const [catalogue, setCatalogue] = useState([]);
  const [loadingCatalogue, setLoadingCatalogue] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('TOUS');

  // État du panier
  const [panier, setPanier] = useState([]);

  // État du calculateur financier
  const [remisePourcent, setRemisePourcent] = useState(0);

  // État de la cible
  const [targetSexe, setTargetSexe] = useState('MIXTE');
  const [targetAge, setTargetAge] = useState('TOUS');

  // État de la simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationError, setSimulationError] = useState(null);

  // Charger le catalogue au montage
  useEffect(() => {
    fetchCatalogue();
  }, []);

  const fetchCatalogue = async () => {
    try {
      setLoadingCatalogue(true);
      const response = await fetch(`${API_BASE_URL}/api/catalogue`);
      if (!response.ok) throw new Error('Erreur lors du chargement du catalogue');
      const data = await response.json();
      setCatalogue(data.supports);
    } catch (error) {
      console.error('Erreur catalogue:', error);
      // Fallback avec données locales si l'API n'est pas disponible
      setCatalogue(getLocalCatalogue());
    } finally {
      setLoadingCatalogue(false);
    }
  };

  // Filtrer le catalogue
  const filteredCatalogue = useMemo(() => {
    return catalogue.filter(support => {
      const matchSearch = !searchTerm ||
        support.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        support.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = activeFilter === 'TOUS' || support.categorie === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [catalogue, searchTerm, activeFilter]);

  // Calculs financiers
  const totaux = useMemo(() => {
    const totalBrutHT = panier.reduce((sum, item) => sum + item.prix_ht * item.quantite, 0);
    const montantRemise = totalBrutHT * (remisePourcent / 100);
    const totalNetHT = totalBrutHT - montantRemise;
    const tva = totalNetHT * 0.20;
    const totalTTC = totalNetHT + tva;

    return {
      totalBrutHT,
      montantRemise,
      totalNetHT,
      tva,
      totalTTC
    };
  }, [panier, remisePourcent]);

  // Actions du panier
  const ajouterAuPanier = (support) => {
    setPanier(prev => {
      const existing = prev.find(item => item.id === support.id);
      if (existing) {
        return prev.map(item =>
          item.id === support.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      }
      return [...prev, { ...support, quantite: 1 }];
    });
    // Reset simulation si panier modifié
    setSimulationResult(null);
  };

  const modifierQuantite = (supportId, delta) => {
    setPanier(prev => prev.map(item => {
      if (item.id === supportId) {
        const newQty = Math.max(1, item.quantite + delta);
        return { ...item, quantite: newQty };
      }
      return item;
    }));
    setSimulationResult(null);
  };

  const supprimerDuPanier = (supportId) => {
    setPanier(prev => prev.filter(item => item.id !== supportId));
    setSimulationResult(null);
  };

  const viderPanier = () => {
    setPanier([]);
    setSimulationResult(null);
  };

  // Lancer la simulation
  const lancerSimulation = async () => {
    if (panier.length === 0) return;

    setIsSimulating(true);
    setSimulationError(null);

    const requestBody = {
      items: panier.map(item => ({
        id: item.id,
        quantite: item.quantite
      })),
      target_sexe: targetSexe,
      target_age: targetAge,
      budget_net_ht: totaux.totalNetHT
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/plan/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur de simulation');
      }

      const result = await response.json();
      setSimulationResult({
        ...result,
        panier: panier,
        totaux: totaux,
        cible: { sexe: targetSexe, age: targetAge }
      });
    } catch (error) {
      console.error('Erreur simulation:', error);
      setSimulationError(error.message);
      // Fallback calcul local
      setSimulationResult(calculerKPILocal(panier, totaux, targetSexe, targetAge));
    } finally {
      setIsSimulating(false);
    }
  };

  const renderIcon = (iconName) => {
    const IconComponent = IconMap[iconName] || Newspaper;
    return <IconComponent size={20} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-corse-rouge to-red-700 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Calculator size={28} />
            Simulation KPI Prévisionnels
          </h1>
          <p className="text-red-100 mt-1">
            Construisez votre panier média et obtenez une projection des performances
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne Gauche - Catalogue */}
          <div className="lg:col-span-2 space-y-4">
            {/* Barre de recherche */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher un support..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Filtres rapides */}
                <div className="flex gap-2 flex-wrap">
                  {['TOUS', 'PRINT', 'DIGITAL', 'SOCIAL', 'PACK'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        activeFilter === filter
                          ? 'bg-corse-rouge text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grille des supports */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Filter size={20} />
                Catalogue des supports
                <span className="text-sm font-normal text-gray-500">
                  ({filteredCatalogue.length} résultats)
                </span>
              </h2>

              {loadingCatalogue ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-corse-rouge" size={32} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredCatalogue.map(support => {
                    const colors = CATEGORY_COLORS[support.categorie];
                    const inPanier = panier.find(p => p.id === support.id);

                    return (
                      <div
                        key={support.id}
                        className={`border rounded-xl p-4 transition-all hover:shadow-md ${
                          inPanier ? 'ring-2 ring-corse-rouge bg-red-50' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg ${colors.bg}`}>
                            <span className={colors.text}>
                              {renderIcon(support.icon)}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {support.categorie}
                          </span>
                        </div>

                        <h3 className="font-semibold text-gray-800 mb-1">{support.nom}</h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {support.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">
                            {support.prix_ht.toLocaleString('fr-FR')} €
                            <span className="text-xs font-normal text-gray-500 ml-1">HT</span>
                          </div>

                          <button
                            onClick={() => ajouterAuPanier(support)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                              inPanier
                                ? 'bg-corse-rouge text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-corse-rouge hover:text-white'
                            }`}
                          >
                            <Plus size={16} />
                            {inPanier ? `(${inPanier.quantite})` : 'Ajouter'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Colonne Droite - Panier & Calculateur */}
          <div className="lg:col-span-1 space-y-4">
            {/* En-tête Panier */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Panier
                  {panier.length > 0 && (
                    <span className="bg-corse-rouge text-white text-xs px-2 py-1 rounded-full">
                      {panier.reduce((sum, item) => sum + item.quantite, 0)}
                    </span>
                  )}
                </h2>
                {panier.length > 0 && (
                  <button
                    onClick={viderPanier}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Vider
                  </button>
                )}
              </div>

              {/* Liste des items */}
              {panier.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ShoppingCart size={40} className="mx-auto mb-2 opacity-50" />
                  <p>Votre panier est vide</p>
                  <p className="text-sm">Ajoutez des supports depuis le catalogue</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {panier.map(item => {
                    const colors = CATEGORY_COLORS[item.categorie];
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate text-sm">
                            {item.nom}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.prix_ht.toLocaleString('fr-FR')} € × {item.quantite}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => modifierQuantite(item.id, -1)}
                            className="p-1 rounded bg-white shadow-sm hover:bg-gray-100"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-medium text-sm">
                            {item.quantite}
                          </span>
                          <button
                            onClick={() => modifierQuantite(item.id, 1)}
                            className="p-1 rounded bg-white shadow-sm hover:bg-gray-100"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => supprimerDuPanier(item.id)}
                            className="p-1 rounded bg-white shadow-sm hover:bg-red-100 text-red-500 ml-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Calculateur Financier */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calculator size={20} />
                Calculateur Financier
              </h3>

              <div className="space-y-3">
                {/* Total Brut */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Brut HT</span>
                  <span className="font-medium">{totaux.totalBrutHT.toLocaleString('fr-FR')} €</span>
                </div>

                {/* Remise */}
                <div className="flex items-center justify-between gap-3 py-2 border-y border-gray-100">
                  <div className="flex items-center gap-2">
                    <Percent size={16} className="text-green-600" />
                    <span className="text-sm text-gray-600">Remise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={remisePourcent}
                      onChange={(e) => setRemisePourcent(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-16 px-2 py-1 border rounded text-right text-sm"
                    />
                    <span className="text-sm text-gray-500">%</span>
                    <span className="text-sm text-green-600 font-medium">
                      -{totaux.montantRemise.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                </div>

                {/* Total Net HT */}
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">Total Net HT</span>
                  <span className="font-bold text-lg text-gray-900">
                    {totaux.totalNetHT.toLocaleString('fr-FR')} €
                  </span>
                </div>

                {/* TVA */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span>{totaux.tva.toLocaleString('fr-FR')} €</span>
                </div>

                {/* Total TTC */}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total TTC</span>
                  <span className="font-bold text-xl text-corse-rouge">
                    {totaux.totalTTC.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>
            </div>

            {/* Sélecteurs de Cible */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target size={20} />
                Cible de la campagne
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexe
                  </label>
                  <select
                    value={targetSexe}
                    onChange={(e) => {
                      setTargetSexe(e.target.value);
                      setSimulationResult(null);
                    }}
                    className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                  >
                    <option value="MIXTE">Mixte (Tous)</option>
                    <option value="FEMME">Femmes</option>
                    <option value="HOMME">Hommes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tranche d'âge
                  </label>
                  <select
                    value={targetAge}
                    onChange={(e) => {
                      setTargetAge(e.target.value);
                      setSimulationResult(null);
                    }}
                    className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                  >
                    <option value="TOUS">Tous les âges</option>
                    <option value="25-49">25-49 ans</option>
                    <option value="50+">50 ans et plus</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bouton de simulation */}
            <button
              onClick={lancerSimulation}
              disabled={panier.length === 0 || isSimulating}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                panier.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-corse-rouge to-red-600 text-white hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {isSimulating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Calcul en cours...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Lancer la Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Résultats de la simulation */}
        {simulationResult && (
          <div className="mt-8">
            <ResultView result={simulationResult} />
          </div>
        )}
      </div>
    </div>
  );
};

// Catalogue local de fallback
const getLocalCatalogue = () => [
  { id: "cm_pleine_page", nom: "Pleine Page Couleur", categorie: "PRINT", description: "Pleine page couleur dans le journal", prix_ht: 4500, icon: "Newspaper", audience_brute: 85000 },
  { id: "cm_demi_page", nom: "Demi-Page Couleur", categorie: "PRINT", description: "Demi-page couleur dans le journal", prix_ht: 2800, icon: "Newspaper", audience_brute: 75000 },
  { id: "cm_quart_page", nom: "Quart de Page", categorie: "PRINT", description: "Quart de page couleur", prix_ht: 1600, icon: "Newspaper", audience_brute: 65000 },
  { id: "web_habillage", nom: "Habillage Site Web", categorie: "DIGITAL", description: "Habillage complet de la homepage", prix_ht: 1800, icon: "Monitor", audience_brute: 120000 },
  { id: "web_megabanner", nom: "Méga Banner", categorie: "DIGITAL", description: "Banner 970x250 en haut de page", prix_ht: 950, icon: "Monitor", audience_brute: 95000 },
  { id: "web_pave", nom: "Pavé 300x250", categorie: "DIGITAL", description: "Pavé publicitaire sidebar", prix_ht: 650, icon: "Monitor", audience_brute: 80000 },
  { id: "fb_post_sponsorise", nom: "Post Facebook", categorie: "SOCIAL", description: "Publication sponsorisée Facebook", prix_ht: 450, icon: "Share2", audience_brute: 65000 },
  { id: "insta_post", nom: "Post Instagram", categorie: "SOCIAL", description: "Publication sponsorisée Instagram", prix_ht: 550, icon: "Share2", audience_brute: 55000 },
  { id: "insta_reel", nom: "Reel Instagram", categorie: "SOCIAL", description: "Reel vidéo sponsorisé", prix_ht: 700, icon: "Share2", audience_brute: 70000 },
  { id: "pack_360", nom: "Pack 360° Premium", categorie: "PACK", description: "Print + Digital + Social", prix_ht: 8500, icon: "Package", audience_brute: 180000 },
  { id: "pack_print_digital", nom: "Pack Print + Digital", categorie: "PACK", description: "Journal + Site Web combinés", prix_ht: 5800, icon: "Package", audience_brute: 140000 },
  { id: "pack_digital_social", nom: "Pack Digital + Social", categorie: "PACK", description: "Site Web + Réseaux sociaux", prix_ht: 3200, icon: "Package", audience_brute: 130000 },
];

// Calcul KPI local de fallback
const calculerKPILocal = (panier, totaux, targetSexe, targetAge) => {
  const POPULATION = {
    MIXTE_TOUS: 260000,
    FEMME_TOUS: 135000,
    HOMME_TOUS: 125000,
    MIXTE_25_49: 110000,
    MIXTE_50_PLUS: 120000,
    FEMME_25_49: 58000,
    FEMME_50_PLUS: 67000,
    HOMME_25_49: 52000,
    HOMME_50_PLUS: 53000,
  };

  const SEGMENT_POP = {
    FEMME: 135000,
    HOMME: 125000,
    "25-49": 110000,
    "50+": 120000,
  };

  const key = `${targetSexe}_${targetAge === 'TOUS' ? 'TOUS' : targetAge.replace('-', '_').replace('+', '_PLUS')}`;
  const populationCible = POPULATION[key] || POPULATION.MIXTE_TOUS;

  let totalImpressions = 0;
  let budgetPrint = 0, budgetDigital = 0, budgetSocial = 0, budgetPack = 0;
  const detailSupports = [];

  panier.forEach(item => {
    const impressions = (item.audience_brute || 50000) * item.quantite;
    totalImpressions += impressions;
    
    const itemBudget = item.prix_ht * item.quantite;
    if (item.categorie === 'PRINT') budgetPrint += itemBudget;
    else if (item.categorie === 'DIGITAL') budgetDigital += itemBudget;
    else if (item.categorie === 'SOCIAL') budgetSocial += itemBudget;
    else budgetPack += itemBudget;

    detailSupports.push({
      id: item.id,
      nom: item.nom,
      categorie: item.categorie,
      budget: itemBudget,
      audience: Math.floor(impressions * 0.6),
      impressions
    });
  });

  // Calcul avec déduplication et plafond de saturation
  const tauxBrut = totalImpressions / populationCible;
  const facteurDedup = panier.length > 2 ? 0.85 : 0.75;
  const audienceNette = Math.min(
    Math.floor(populationCible * (1 - Math.pow(1 - facteurDedup, tauxBrut)) * 0.96),
    Math.floor(populationCible * 0.96)
  );
  
  const grp = (totalImpressions / populationCible) * 100;
  const budgetTotal = budgetPrint + budgetDigital + budgetSocial + budgetPack;
  const tauxCouverture = (audienceNette / populationCible) * 100;

  // Calcul de pénétration par segment basé sur le taux de couverture
  const calculerPenetration = (segmentPop) => {
    const baseRate = tauxCouverture * (0.8 + Math.random() * 0.4); // Variation ±20%
    return Math.min(Math.max(baseRate, 5), 96); // Entre 5% et 96%
  };

  const penetration_par_segment = {
    "FEMME": Math.round(calculerPenetration(SEGMENT_POP.FEMME) * 10) / 10,
    "HOMME": Math.round(calculerPenetration(SEGMENT_POP.HOMME) * 10) / 10,
    "25-49": Math.round(calculerPenetration(SEGMENT_POP["25-49"]) * 10) / 10,
    "50+": Math.round(calculerPenetration(SEGMENT_POP["50+"]) * 10) / 10,
  };

  // Répartition budget
  const repartPrint = budgetTotal > 0 ? ((budgetPrint + budgetPack * 0.4) / budgetTotal) * 100 : 0;
  const repartDigital = budgetTotal > 0 ? ((budgetDigital + budgetSocial + budgetPack * 0.6) / budgetTotal) * 100 : 0;

  return {
    audience_nette: audienceNette,
    total_impressions: totalImpressions,
    grp: Math.round(grp * 100) / 100,
    taux_couverture: Math.round(tauxCouverture * 100) / 100,
    frequence_moyenne: audienceNette > 0 ? Math.round((totalImpressions / audienceNette) * 100) / 100 : 0,
    cpm_moyen: totalImpressions > 0 ? Math.round((totaux.totalNetHT / totalImpressions) * 100000) / 100 : 0,
    cout_par_grp: grp > 0 ? Math.round((totaux.totalNetHT / grp) * 100) / 100 : 0,
    total_clics: Math.floor(totalImpressions * 0.012),
    total_vues_video: Math.floor(totalImpressions * 0.15),
    repartition_print: Math.round(repartPrint * 10) / 10,
    repartition_digital: Math.round(repartDigital * 10) / 10,
    profil_audience: { femme: 52, homme: 48, age_25_49: 45, age_50_plus: 45, csp_plus: 42 },
    penetration_par_segment,
    detail_par_support: detailSupports,
    tunnel_conversion: {
      impressions: totalImpressions,
      audience_nette: audienceNette,
      clics: Math.floor(totalImpressions * 0.012),
      vues_video: Math.floor(totalImpressions * 0.15)
    },
    panier,
    totaux,
    cible: { sexe: targetSexe, age: targetAge }
  };
};

export default SimulationMode;
