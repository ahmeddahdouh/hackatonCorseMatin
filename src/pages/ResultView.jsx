/**
 * ResultView.jsx
 * Visualisation des résultats de simulation KPI
 * Inclut: Header chiffré, Sankey, Funnel, Jauge GRP, Waffle Chart
 */

import React, { useRef, useMemo } from 'react';
import {
  Users, Eye, TrendingUp, DollarSign, Target, Download,
  BarChart3, PieChart, Activity, Zap, ArrowRight, FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer, FunnelChart, Funnel, LabelList,
  Cell, Tooltip
} from 'recharts';
import { ResponsiveSankey } from '@nivo/sankey';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Design System - Couleurs
const COLORS = {
  rouge: '#b91c1c',
  bleu: '#1e40af',
  gris: '#1c1917',
  vert: '#15803d',
  vertFonce: '#166534',
  orange: '#ea580c',
  violet: '#7c3aed',
  ambre: '#d97706',
};

const CATEGORY_COLORS = {
  PRINT: COLORS.rouge,
  DIGITAL: COLORS.bleu,
  SOCIAL: COLORS.violet,
  PACK: COLORS.ambre,
};

const ResultView = ({ result }) => {
  const reportRef = useRef(null);

  // Préparer les données pour le Sankey
  const sankeyData = useMemo(() => {
    if (!result.detail_par_support || result.detail_par_support.length === 0) {
      return null;
    }

    const nodes = [
      { id: 'Budget Total', color: COLORS.gris },
    ];

    const links = [];
    const categoriesAdded = new Set();

    // Ajouter les catégories comme noeuds intermédiaires
    result.detail_par_support.forEach(support => {
      if (!categoriesAdded.has(support.categorie)) {
        nodes.push({
          id: support.categorie,
          color: CATEGORY_COLORS[support.categorie] || COLORS.gris
        });
        categoriesAdded.add(support.categorie);
      }
    });

    // Calculer le budget total par catégorie
    const budgetParCategorie = {};
    result.detail_par_support.forEach(support => {
      if (!budgetParCategorie[support.categorie]) {
        budgetParCategorie[support.categorie] = 0;
      }
      budgetParCategorie[support.categorie] += support.budget;
    });

    // Liens Budget Total -> Catégories
    Object.entries(budgetParCategorie).forEach(([categorie, budget]) => {
      links.push({
        source: 'Budget Total',
        target: categorie,
        value: Math.max(budget, 1)
      });
    });

    // Ajouter les supports comme noeuds finaux et liens
    result.detail_par_support.forEach(support => {
      nodes.push({
        id: support.nom,
        color: CATEGORY_COLORS[support.categorie] || COLORS.gris
      });
      links.push({
        source: support.categorie,
        target: support.nom,
        value: Math.max(support.budget, 1)
      });
    });

    return { nodes, links };
  }, [result]);

  // Données pour le Funnel
  const funnelData = useMemo(() => {
    const tunnel = result.tunnel_conversion || {
      impressions: result.total_impressions,
      audience_nette: result.audience_nette,
      clics: result.total_clics
    };

    return [
      { name: 'Impressions', value: tunnel.impressions, fill: COLORS.gris },
      { name: 'Audience Nette', value: tunnel.audience_nette, fill: COLORS.bleu },
      { name: 'Clics/Actions', value: tunnel.clics, fill: COLORS.rouge },
    ];
  }, [result]);

  // Export PDF
  const exportToPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Header
      pdf.setFillColor(185, 28, 28);
      pdf.rect(0, 0, pdfWidth, 25, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text('Corse-Matin - Simulation KPI Prévisionnels', 10, 15);
      pdf.setFontSize(10);
      pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pdfWidth - 50, 15);

      // Contenu
      if (pdfHeight > pdf.internal.pageSize.getHeight() - 35) {
        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = pdfHeight;
        let position = 30;

        pdf.addImage(imgData, 'PNG', 5, position, pdfWidth - 10, pdfHeight);
        heightLeft -= (pageHeight - 30);

        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 5, position, pdfWidth - 10, pdfHeight);
          heightLeft -= pageHeight;
        }
      } else {
        pdf.addImage(imgData, 'PNG', 5, 30, pdfWidth - 10, pdfHeight);
      }

      pdf.save(`simulation-kpi-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    }
  };

  // Export Excel
  const exportToExcel = () => {
    try {
      const workbook = XLSX.utils.book_new();

      // Feuille 1: Résumé KPIs
      const kpisData = [
        ['SIMULATION KPI PRÉVISIONNELS - CORSE-MATIN'],
        ['Date de génération', new Date().toLocaleDateString('fr-FR')],
        [],
        ['INDICATEURS CLÉS DE PERFORMANCE'],
        [],
        ['KPI', 'Valeur', 'Unité'],
        ['Audience Nette', result.audience_nette, 'personnes'],
        ['Impressions Totales', result.total_impressions, 'contacts'],
        ['GRP', result.grp, 'points'],
        ['Taux de Couverture', result.taux_couverture, '%'],
        ['Fréquence Moyenne', result.frequence_moyenne, 'x'],
        ['CPM Moyen', result.cpm_moyen, '€'],
        ['Coût par GRP', result.cout_par_grp, '€'],
        ['Clics Estimés', result.total_clics, 'clics'],
        ['Vues Vidéo', result.total_vues_video, 'vues'],
        [],
        ['RÉPARTITION MÉDIA'],
        ['Type', 'Pourcentage'],
        ['Print', `${result.repartition_print}%`],
        ['Digital', `${result.repartition_digital}%`],
      ];
      const wsKpis = XLSX.utils.aoa_to_sheet(kpisData);
      
      // Style de la feuille KPIs
      wsKpis['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, wsKpis, 'Résumé KPIs');

      // Feuille 2: Détail du Panier
      const panierHeader = ['DÉTAIL DU PANIER MÉDIA'];
      const panierColumns = ['Support', 'Catégorie', 'Quantité', 'Prix Unitaire HT (€)', 'Total HT (€)', 'Audience', 'Impressions'];
      const panierRows = result.detail_par_support?.map(item => [
        item.nom,
        item.categorie,
        result.panier?.find(p => p.id === item.id)?.quantite || 1,
        result.panier?.find(p => p.id === item.id)?.prix_ht || item.budget,
        item.budget,
        item.audience,
        item.impressions
      ]) || [];

      const panierData = [
        panierHeader,
        [],
        panierColumns,
        ...panierRows,
        [],
        ['TOTAL', '', '', '', result.totaux?.totalBrutHT || 0, '', result.total_impressions],
        [],
        ['CALCUL FINANCIER'],
        ['Total Brut HT', result.totaux?.totalBrutHT?.toFixed(2) || 0, '€'],
        ['Remise', result.totaux?.montantRemise?.toFixed(2) || 0, '€'],
        ['Total Net HT', result.totaux?.totalNetHT?.toFixed(2) || 0, '€'],
        ['TVA (20%)', result.totaux?.tva?.toFixed(2) || 0, '€'],
        ['Total TTC', result.totaux?.totalTTC?.toFixed(2) || 0, '€'],
      ];
      const wsPanier = XLSX.utils.aoa_to_sheet(panierData);
      wsKpis['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, wsPanier, 'Détail Panier');

      // Feuille 3: Pénétration par Segment
      const segmentData = [
        ['PÉNÉTRATION PAR SEGMENT DE POPULATION'],
        [],
        ['Segment', 'Pénétration (%)'],
        ...Object.entries(result.penetration_par_segment || {}).map(([seg, val]) => [
          seg === 'FEMME' ? 'Femmes' : seg === 'HOMME' ? 'Hommes' : seg === '25-49' ? '25-49 ans' : seg === '50+' ? '50+ ans' : seg,
          val.toFixed(1)
        ]),
        [],
        ['PROFIL AUDIENCE TOUCHÉE'],
        [],
        ['Critère', 'Pourcentage'],
        ['Femmes', `${result.profil_audience?.femme || 0}%`],
        ['Hommes', `${result.profil_audience?.homme || 0}%`],
        ['25-49 ans', `${result.profil_audience?.age_25_49 || 0}%`],
        ['50+ ans', `${result.profil_audience?.age_50_plus || 0}%`],
        ['CSP+', `${result.profil_audience?.csp_plus || 0}%`],
      ];
      const wsSegment = XLSX.utils.aoa_to_sheet(segmentData);
      wsSegment['!cols'] = [{ wch: 20 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, wsSegment, 'Segments');

      // Feuille 4: Tunnel de Conversion
      const tunnelData = [
        ['TUNNEL DE CONVERSION'],
        [],
        ['Étape', 'Volume', 'Taux'],
        ['Impressions', result.tunnel_conversion?.impressions || result.total_impressions, '100%'],
        ['Audience Nette', result.tunnel_conversion?.audience_nette || result.audience_nette, 
          `${((result.audience_nette / result.total_impressions) * 100).toFixed(1)}%`],
        ['Clics', result.tunnel_conversion?.clics || result.total_clics,
          `${((result.total_clics / result.total_impressions) * 100).toFixed(2)}%`],
        ['Vues Vidéo', result.tunnel_conversion?.vues_video || result.total_vues_video,
          `${((result.total_vues_video / result.total_impressions) * 100).toFixed(1)}%`],
      ];
      const wsTunnel = XLSX.utils.aoa_to_sheet(tunnelData);
      wsTunnel['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(workbook, wsTunnel, 'Conversion');

      // Générer le fichier
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `plan-media-simulation-${Date.now()}.xlsx`);

    } catch (error) {
      console.error('Erreur export Excel:', error);
      alert('Erreur lors de l\'export Excel');
    }
  };

  // Formatage des nombres
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString('fr-FR');
  };

  return (
    <div className="space-y-6">
      {/* Boutons Export */}
      <div className="flex justify-end gap-3">
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md"
        >
          <FileSpreadsheet size={18} />
          Exporter en Excel
        </button>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2 bg-corse-rouge text-white rounded-lg hover:bg-red-700 transition-all shadow-md"
        >
          <Download size={18} />
          Exporter en PDF
        </button>
      </div>

      <div ref={reportRef} className="space-y-6 bg-gray-50 p-2">
        {/* Header Chiffré - 4 Cartes KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={Users}
            label="Audience Nette"
            value={formatNumber(result.audience_nette)}
            sublabel="personnes uniques"
            color="blue"
          />
          <KPICard
            icon={Eye}
            label="Contacts Totaux"
            value={formatNumber(result.total_impressions)}
            sublabel="impressions"
            color="gray"
          />
          <KPICard
            icon={DollarSign}
            label="CPM Moyen"
            value={`${result.cpm_moyen?.toFixed(2) || 0} €`}
            sublabel="coût/1000 impressions"
            color="green"
          />
          <KPICard
            icon={Target}
            label="Couverture"
            value={`${result.taux_couverture?.toFixed(1) || 0}%`}
            sublabel="de la cible touchée"
            color="red"
          />
        </div>

        {/* KPIs Secondaires */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-sm text-gray-500">GRP</div>
            <div className="text-2xl font-bold text-gray-900">{result.grp?.toFixed(1) || 0}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-sm text-gray-500">Fréquence Moy.</div>
            <div className="text-2xl font-bold text-gray-900">{result.frequence_moyenne?.toFixed(1) || 0}x</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-sm text-gray-500">Coût/GRP</div>
            <div className="text-2xl font-bold text-gray-900">{result.cout_par_grp?.toFixed(0) || 0} €</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-sm text-gray-500">Clics Estimés</div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(result.total_clics)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-sm text-gray-500">Vues Vidéo</div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(result.total_vues_video)}</div>
          </div>
        </div>

        {/* Ligne de graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sankey Diagram */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-corse-rouge" />
              Répartition du Budget
            </h3>
            <div className="h-[350px]">
              {sankeyData ? (
                <ResponsiveSankey
                  data={sankeyData}
                  margin={{ top: 20, right: 140, bottom: 20, left: 20 }}
                  align="justify"
                  colors={(node) => node.color || COLORS.gris}
                  nodeOpacity={1}
                  nodeThickness={18}
                  nodeInnerPadding={3}
                  nodeSpacing={24}
                  nodeBorderWidth={0}
                  nodeBorderRadius={3}
                  linkOpacity={0.75}
                  linkHoverOthersOpacity={0.1}
                  linkContract={3}
                  enableLinkGradient={false}
                  labelPosition="outside"
                  labelOrientation="horizontal"
                  labelPadding={12}
                  labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>

          {/* Tunnel de Conversion */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-corse-rouge" />
              Tunnel de Conversion
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip
                    formatter={(value) => formatNumber(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList
                      position="right"
                      fill="#374151"
                      stroke="none"
                      dataKey="name"
                      fontSize={14}
                    />
                    <LabelList
                      position="center"
                      fill="#ffffff"
                      stroke="none"
                      dataKey="value"
                      formatter={(value) => formatNumber(value)}
                      fontSize={12}
                      fontWeight="bold"
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Jauge GRP et Waffle Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jauge de Pression GRP */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-corse-rouge" />
              Pression Publicitaire (GRP)
            </h3>
            <GRPGauge grp={result.grp || 0} />
          </div>

          {/* Waffle Chart - Pénétration Population */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart size={20} className="text-corse-rouge" />
              Pénétration de la Cible
            </h3>
            <WaffleChart
              percentage={result.taux_couverture || 0}
              penetrationSegments={result.penetration_par_segment || {}}
            />
          </div>
        </div>

        {/* Répartition Print/Digital */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Répartition Media
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-700 font-medium">Print</span>
                <span>{result.repartition_print?.toFixed(1) || 0}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all"
                  style={{ width: `${result.repartition_print || 0}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-700 font-medium">Digital</span>
                <span>{result.repartition_digital?.toFixed(1) || 0}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${result.repartition_digital || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profil d'Audience */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Profil de l'Audience Touchée
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {result.profil_audience && (
              <>
                <ProfileBar label="Femmes" value={result.profil_audience.femme} color="pink" />
                <ProfileBar label="Hommes" value={result.profil_audience.homme} color="blue" />
                <ProfileBar label="25-49 ans" value={result.profil_audience.age_25_49} color="green" />
                <ProfileBar label="50+ ans" value={result.profil_audience.age_50_plus} color="orange" />
                <ProfileBar label="CSP+" value={result.profil_audience.csp_plus} color="purple" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Carte KPI
const KPICard = ({ icon: Icon, label, value, sublabel, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  const iconClasses = {
    blue: 'bg-blue-100 text-blue-600',
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className={`rounded-xl p-4 border-2 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg ${iconClasses[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs opacity-75">{sublabel}</div>
    </div>
  );
};

// Composant Jauge GRP
const GRPGauge = ({ grp }) => {
  const maxGRP = 400;
  const percentage = Math.min((grp / maxGRP) * 100, 100);

  // Déterminer la couleur selon le GRP
  let gaugeColor = COLORS.gris;
  let statusText = 'Discret';
  let statusColor = 'text-gray-500';

  if (grp < 30) {
    gaugeColor = '#9ca3af'; // gris
    statusText = 'Discret';
    statusColor = 'text-gray-500';
  } else if (grp < 60) {
    gaugeColor = COLORS.orange;
    statusText = 'Visibilité';
    statusColor = 'text-orange-500';
  } else if (grp < 100) {
    gaugeColor = COLORS.vert;
    statusText = 'Efficace';
    statusColor = 'text-green-500';
  } else if (grp < 300) {
    gaugeColor = COLORS.vertFonce;
    statusText = 'DOMINANT';
    statusColor = 'text-green-700 font-bold';
  } else {
    gaugeColor = COLORS.rouge;
    statusText = 'Saturation';
    statusColor = 'text-red-600';
  }

  return (
    <div className="flex flex-col items-center">
      <svg width="250" height="150" viewBox="0 0 250 150">
        {/* Arc de fond */}
        <path
          d="M 25 125 A 100 100 0 0 1 225 125"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Arc de progression */}
        <path
          d="M 25 125 A 100 100 0 0 1 225 125"
          fill="none"
          stroke={gaugeColor}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 3.14} 314`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        {/* Graduations */}
        {[0, 30, 60, 100, 300, 400].map((val, i) => {
          const angle = -180 + (val / maxGRP) * 180;
          const rad = (angle * Math.PI) / 180;
          const x1 = 125 + 85 * Math.cos(rad);
          const y1 = 125 + 85 * Math.sin(rad);
          const x2 = 125 + 95 * Math.cos(rad);
          const y2 = 125 + 95 * Math.sin(rad);
          const tx = 125 + 110 * Math.cos(rad);
          const ty = 125 + 110 * Math.sin(rad);
          return (
            <g key={val}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9ca3af" strokeWidth="2" />
              <text x={tx} y={ty} textAnchor="middle" fontSize="10" fill="#6b7280">
                {val}
              </text>
            </g>
          );
        })}
        {/* Valeur centrale */}
        <text x="125" y="100" textAnchor="middle" fontSize="36" fontWeight="bold" fill={gaugeColor}>
          {grp.toFixed(0)}
        </text>
        <text x="125" y="120" textAnchor="middle" fontSize="12" fill="#6b7280">
          GRP
        </text>
      </svg>
      <div className={`text-lg ${statusColor} mt-2`}>
        {statusText}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        Échelle: 0 - 400 GRP
      </div>
    </div>
  );
};

// Composant Waffle Chart
const WaffleChart = ({ percentage, penetrationSegments }) => {
  const totalCells = 100;
  const safePercentage = typeof percentage === 'number' && !isNaN(percentage) ? percentage : 0;
  const filledCells = Math.round(Math.min(Math.max(safePercentage, 0), 100));

  // Labels des segments pour un meilleur affichage
  const segmentLabels = {
    'FEMME': 'Femmes',
    'HOMME': 'Hommes',
    '25-49': '25-49 ans',
    '50+': '50+ ans',
    '50_PLUS': '50+ ans'
  };

  return (
    <div className="space-y-4">
      {/* Grille 10x10 */}
      <div className="flex justify-center">
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: totalCells }).map((_, i) => {
            const isFilled = i < filledCells;
            // Calcul d'opacité sécurisé
            const opacity = isFilled && filledCells > 0 
              ? Math.max(0.7, 1 - (i / filledCells) * 0.3) 
              : 0.3;
            return (
              <div
                key={i}
                className={`w-5 h-5 rounded transition-all ${
                  isFilled ? 'bg-emerald-500 shadow-sm' : 'bg-gray-200'
                }`}
                style={{ opacity }}
                title={isFilled ? `${i + 1}%` : ''}
              />
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <span className="text-3xl font-bold text-emerald-600">{safePercentage.toFixed(1)}%</span>
        <span className="text-gray-500 ml-2 text-sm">de la cible touchée</span>
      </div>

      {/* Barres par segment */}
      {penetrationSegments && Object.keys(penetrationSegments).length > 0 && (
        <div className="space-y-3 pt-4 border-t">
          <div className="text-sm font-medium text-gray-700 mb-3">Pénétration par segment</div>
          {Object.entries(penetrationSegments).map(([segment, value]) => {
            const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
            const label = segmentLabels[segment] || segment;
            return (
              <div key={segment} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-20 font-medium">{label}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(Math.max(safeValue, 0), 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-800 w-14 text-right">
                  {safeValue.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Composant Barre de Profil
const ProfileBar = ({ label, value, color }) => {
  const colorMap = {
    pink: 'bg-pink-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-800">{value}%</div>
      <div className="text-sm text-gray-500 mb-2">{label}</div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} rounded-full transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default ResultView;
