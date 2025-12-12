/**
 * Loader pour les données Corse Matin - Version Complète
 * Basé uniquement sur data/corse_matin_data.json
 */

let corsData = null;

/**
 * Charger et parser le fichier corse_matin_data.json
 */
export const loadCorsData = async () => {
  if (corsData) return corsData;

  try {
    const response = await fetch('/data/corse_matin_data.json');
    const text = await response.text();
    corsData = parseAllSections(text);
    return corsData;
  } catch (error) {
    console.error('Erreur lors du chargement des données Corse Matin:', error);
    return getDefaultData();
  }
};

/**
 * Parser toutes les sections du fichier JSON
 */
const parseAllSections = (text) => {
  const data = {
    audiences: [],
    audienceDiverto: [],
    audienceCorseMatin: [],
    audienceFemina: [],
    socialMedia: [],
    traffic: [],
    webTraffic: [],
    tarifPrivilege: [],
    tarifPrivilegeV2: [],
    gammePerformance: {
      corseInfo: [],
      sports: [],
      localesSansRigueur: []
    },
    packProxiCorse: [],
    packProxiBiMedia: [],
    emploiIntForm: [],
    immoMoteurs: [],
    settimana: [],
    supplementThematiques: [],
    divertoJaquette: [],
    divertoModPub: [],
    divertoEncart: [],
    divertoEvenement: [],
    feminaTriangle: [],
    feminaTdceDeco: [],
    encartsFemina: []
  };

  // Parser chaque section avec des regex
  try {
    // Section AUDIENCE principale
    const audienceMatch = text.match(/"audiences"\s*:\s*\[([\s\S]*?)\]\s*\}/);
    if (audienceMatch) {
      data.audiences = JSON.parse('[' + audienceMatch[1] + ']');
    }

    // Section audience_Diverto
    const divertoMatch = text.match(/"audience_Diverto"\s*:\s*\[([\s\S]*?)\]\s*\}/);
    if (divertoMatch) {
      data.audienceDiverto = JSON.parse('[' + divertoMatch[1] + ']');
    }

    // Section audience_corse_matin
    const cmMatch = text.match(/"audience_corse_matin"\s*:\s*\[([\s\S]*?)\]\s*\}/);
    if (cmMatch) {
      data.audienceCorseMatin = JSON.parse('[' + cmMatch[1] + ']');
    }

    // Section audience_femina
    const feminaMatch = text.match(/"audience_femina"\s*:\s*\[([\s\S]*?)\]\s*\}/);
    if (feminaMatch) {
      data.audienceFemina = JSON.parse('[' + feminaMatch[1] + ']');
    }

    // Section corse_matin_social
    const socialMatch = text.match(/"corse_matin_social"\s*:\s*\[([\s\S]*?)\]\s*\}/);
    if (socialMatch) {
      data.socialMedia = JSON.parse('[' + socialMatch[1] + ']');
    }

    // Section traffic
    const trafficMatch = text.match(/"traffic"\s*:\s*\[([\s\S]*?)\]\s*\}/);
    if (trafficMatch) {
      data.traffic = JSON.parse('[' + trafficMatch[1] + ']');
    }

    // Section web_traffic
    const webMatch = text.match(/"web_traffic"\s*:\s*\[([\s\S]*?)\]\s*\}/);
    if (webMatch) {
      data.webTraffic = JSON.parse('[' + webMatch[1] + ']');
    }

    // Section gamme_privilege_quadrichromie
    const privilegeMatch = text.match(/"gamme_privilege_quadrichromie"\s*:\s*\[([\s\S]*?)\]\s*\}/);
    if (privilegeMatch) {
      data.tarifPrivilege = JSON.parse('[' + privilegeMatch[1] + ']');
    }

    // Section gamme_privilege_quadrichromie_v2
    const privilegeV2Match = text.match(/"gamme_privilege_quadrichromie_v2"\s*:\s*\[([\s\S]*?)\]\s*\}/);
    if (privilegeV2Match) {
      data.tarifPrivilegeV2 = JSON.parse('[' + privilegeV2Match[1] + ']');
    }

    // Section gamme_performance
    const perfMatch = text.match(/"gamme_performance"\s*:\s*\{([\s\S]*?)\}\s*\}/);
    if (perfMatch) {
      const perfContent = '{' + perfMatch[1] + '}';
      const perfData = JSON.parse(perfContent);
      data.gammePerformance = {
        corseInfo: perfData.corse_info || [],
        sports: perfData.sports || [],
        localesSansRigueur: perfData.locales_sans_rigueur || []
      };
    }

  } catch (e) {
    console.warn('Erreur parsing sections:', e);
  }

  return data;
};

/**
 * Données par défaut si le chargement échoue
 */
const getDefaultData = () => ({
  audiences: [
    { categorie: "Cible Ensemble", modalite: "Total", CibleEnsemble: 54422000, CorseMatin: 159000 }
  ],
  audienceCorseMatin: [
    { categorie: "Cible Ensemble", modalite: "ENSEMBLE", cible_ensemble: 53665000, corse_matin: 147000 }
  ],
  socialMedia: [
    { mois: "MOYENNE", facebook: 265551, instagram: 107225, linkedin: 6450, tiktok: 22664, x: 100919, youtube: 12767 }
  ],
  traffic: [],
  webTraffic: [
    { periode: "Oct. 25", visites_totales: 2746059, pages_vues_totales: 13992034 }
  ],
  tarifPrivilege: [],
  gammePerformance: { corseInfo: [], sports: [], localesSansRigueur: [] }
});

// ===================== FONCTIONS D'ACCÈS AUX DONNÉES =====================

/**
 * Obtenir l'audience totale Corse Matin
 */
export const getAudienceTotale = () => {
  if (!corsData) return 159000;
  const total = corsData.audiences.find(a => a.categorie === "Cible Ensemble" && a.modalite === "Total");
  return total?.CorseMatin || 159000;
};

/**
 * Obtenir l'audience par catégorie et modalité
 */
export const getAudienceByCategory = (categorie, modalite, support = 'CorseMatin') => {
  if (!corsData) return 0;
  const audience = corsData.audiences.find(a => a.categorie === categorie && a.modalite === modalite);
  return audience?.[support] || 0;
};

/**
 * Obtenir les statistiques social media (moyenne ou dernier mois)
 */
export const getSocialMediaStats = (type = 'moyenne') => {
  if (!corsData || !corsData.socialMedia.length) {
    return { facebook: 265551, instagram: 107225, linkedin: 6450, tiktok: 22664, x: 100919, youtube: 12767 };
  }
  
  if (type === 'moyenne') {
    const moyenne = corsData.socialMedia.find(s => s.mois === "MOYENNE");
    return moyenne || corsData.socialMedia[corsData.socialMedia.length - 1];
  }
  
  return corsData.socialMedia[corsData.socialMedia.length - 1];
};

/**
 * Obtenir les statistiques de trafic web (dernier mois)
 */
export const getWebTrafficStats = () => {
  if (!corsData || !corsData.webTraffic.length) {
    return { visites_totales: 2746059, pages_vues_totales: 13992034, pages_par_visite: 5.1 };
  }
  return corsData.webTraffic[0]; // Premier = plus récent
};

/**
 * Obtenir les tarifs par catégorie
 */
export const getTarifsByCategorie = (categorie) => {
  if (!corsData) return [];
  return corsData.tarifPrivilege.filter(t => t.categorie === categorie);
};

/**
 * Obtenir tous les tarifs Privilège
 */
export const getAllTarifsPrivilege = () => {
  if (!corsData) return [];
  return corsData.tarifPrivilege;
};

/**
 * Obtenir les tarifs de la gamme Performance
 */
export const getTarifsPerformance = (type = 'corseInfo') => {
  if (!corsData) return [];
  return corsData.gammePerformance[type] || [];
};

/**
 * Calculer le CPM basé sur les données réelles
 */
export const calculateCPM = (budget, impressions) => {
  if (!impressions || impressions === 0) return 0;
  return (budget / (impressions / 1000)).toFixed(2);
};

/**
 * Estimer l'audience en fonction du budget et des canaux
 */
export const estimateAudience = (budget, channels = ['Print']) => {
  const baseAudience = getAudienceTotale();
  const social = getSocialMediaStats();
  const web = getWebTrafficStats();
  
  let totalAudience = 0;
  
  channels.forEach(channel => {
    switch(channel) {
      case 'Print':
        // Base: audience Corse Matin * ratio budget
        totalAudience += Math.round(baseAudience * (budget / 10000) * 0.5);
        break;
      case 'Digital':
        // Base: trafic web mensuel * ratio
        totalAudience += Math.round(web.visites_totales * (budget / 10000) * 0.3);
        break;
      case 'Social':
        // Base: total followers social * ratio engagement
        const totalSocial = (social.facebook || 0) + (social.instagram || 0) + (social.linkedin || 0) + (social.tiktok || 0);
        totalAudience += Math.round(totalSocial * (budget / 10000) * 0.4);
        break;
      case 'Event':
        // Estimation événementiel
        totalAudience += Math.round(5000 * (budget / 5000));
        break;
      default:
        break;
    }
  });
  
  return totalAudience;
};

/**
 * Estimer les impressions en fonction de l'audience
 */
export const estimateImpressions = (audience, frequence = 2.5) => {
  return Math.round(audience * frequence);
};

/**
 * Obtenir les catégories d'audience disponibles
 */
export const getAudienceCategories = () => {
  if (!corsData) return [];
  
  const categories = new Set();
  corsData.audiences.forEach(a => categories.add(a.categorie));
  corsData.audienceCorseMatin?.forEach(a => categories.add(a.categorie));
  
  return Array.from(categories);
};

/**
 * Obtenir les modalités par catégorie
 */
export const getModalitesByCategorie = (categorie) => {
  if (!corsData) return [];
  
  const modalites = [];
  corsData.audiences.filter(a => a.categorie === categorie).forEach(a => modalites.push(a.modalite));
  
  return modalites;
};

/**
 * Obtenir les données d'évolution social media
 */
export const getSocialMediaEvolution = () => {
  if (!corsData) return [];
  return corsData.socialMedia.filter(s => s.mois !== "MOYENNE");
};

/**
 * Obtenir les données d'évolution trafic web
 */
export const getWebTrafficEvolution = () => {
  if (!corsData) return [];
  return corsData.webTraffic;
};

export default {
  loadCorsData,
  getAudienceTotale,
  getAudienceByCategory,
  getSocialMediaStats,
  getWebTrafficStats,
  getTarifsByCategorie,
  getAllTarifsPrivilege,
  getTarifsPerformance,
  calculateCPM,
  estimateAudience,
  estimateImpressions,
  getAudienceCategories,
  getModalitesByCategorie,
  getSocialMediaEvolution,
  getWebTrafficEvolution
};
