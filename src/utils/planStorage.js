// Utility pour gérer la sauvegarde et chargement des plans media
export const savePlanMedia = (planData) => {
  try {
    // Récupérer les plans existants
    const existingPlans = JSON.parse(localStorage.getItem('mediaPlans') || '[]');
    
    // Extraire toutes les offres sélectionnées avec détails complets
    const allOffers = [];
    const channelDetails = planData.channelDetails || {};
    let totalOffersAmount = 0;
    
    Object.entries(channelDetails).forEach(([channel, details]) => {
      const offers = details?.selectedOffers || [];
      offers.forEach(offer => {
        const offerAmount = offer.budgetAllocated || offer.budget || (offer.unitPrice * (offer.quantity || 1)) || 0;
        totalOffersAmount += offerAmount;
        allOffers.push({
          id: offer.id || `${channel}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          channel: channel,
          mediaName: offer.mediaName || offer.name || 'Support',
          placement: offer.placement || offer.type || '',
          format: offer.format || '',
          frequency: offer.frequency || '',
          quantity: offer.quantity || 1,
          unitPrice: offer.unitPrice || offer.price || 0,
          budgetAllocated: offerAmount,
          // Détails spécifiques selon le canal
          circulation: offer.circulation || null,
          impressions: offer.impressions || null,
          reach: offer.reach || null,
          followers: offer.followers || null,
          timing: offer.timing || null,
          notes: offer.notes || '',
        });
      });
    });
    
    // Calculer les budgets par canal
    const channelBudgets = {};
    const distribution = planData.effectiveDistribution || planData.distribution || {};
    Object.entries(distribution).forEach(([channel, percent]) => {
      channelBudgets[channel] = {
        percentage: percent,
        amount: Math.round((planData.budget * percent) / 100),
        offersCount: allOffers.filter(o => o.channel === channel).length,
        offersTotal: allOffers.filter(o => o.channel === channel).reduce((sum, o) => sum + o.budgetAllocated, 0)
      };
    });
    
    // Créer un nouvel ID unique
    const newPlan = {
      // Métadonnées
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '2.0',
      
      // Informations client
      client: {
        name: planData.clientName || '',
        matricule: planData.clientMatricule || '',
        sector: planData.sector || '',
      },
      // Compatibilité avec l'ancien format
      clientName: planData.clientName || '',
      clientMatricule: planData.clientMatricule || '',
      sector: planData.sector || '',
      
      // Informations campagne
      campaign: {
        name: planData.campaignName || '',
        duration: planData.campaignDuration || '30 jours',
        startDate: planData.startDate || null,
        endDate: planData.endDate || null,
      },
      campaignName: planData.campaignName || '',
      campaignDuration: planData.campaignDuration || '30 jours',
      
      // Budget
      budget: planData.budget || 0,
      totalOffersAmount: totalOffersAmount,
      budgetRemaining: (planData.budget || 0) - totalOffersAmount,
      
      // Objectifs
      objectives: planData.objectives || [],
      
      // Ciblage
      targets: planData.targets || {
        ageRanges: planData.ageRanges || [],
        gender: planData.gender || 'mixte',
        cspLevels: planData.cspLevels || [],
        interests: planData.interests || [],
        geographicTargets: planData.geographicTargets || [],
      },
      
      // Zone géographique
      geography: {
        region: planData.region || 'corse',
        microRegions: planData.microRegions || [],
        worldLocation: planData.worldLocation || null,
      },
      region: planData.region || 'corse',
      microRegions: planData.microRegions || [],
      worldLocation: planData.worldLocation || null,
      
      // Répartition budgétaire
      distribution: planData.effectiveDistribution || planData.distribution || {},
      effectiveDistribution: planData.effectiveDistribution || {},
      customDistribution: planData.customDistribution || {},
      channelBudgets: channelBudgets,
      
      // Détails par canal (structure originale)
      channelDetails: planData.channelDetails || {},
      
      // Liste des offres (format plat pour faciliter l'affichage)
      offers: allOffers,
      offersCount: allOffers.length,
      
      // KPIs estimés
      kpis: planData.kpis || {
        estimatedReach: Math.round((planData.budget / 0.8) * 1000),
        estimatedImpressions: Math.round((planData.budget / 0.5) * 1000),
        estimatedCPM: parseFloat((planData.budget / (Math.round((planData.budget / 0.5) * 1000) / 1000)).toFixed(2)),
      },
      
      // Statistiques calculées
      stats: {
        totalOffers: allOffers.length,
        totalOffersAmount: totalOffersAmount,
        coveragePercent: planData.budget > 0 ? Math.round((totalOffersAmount / planData.budget) * 100) : 0,
        channelsUsed: Object.keys(distribution).filter(ch => distribution[ch] > 0).length,
      }
    };
    
    // Ajouter le nouveau plan
    existingPlans.push(newPlan);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('mediaPlans', JSON.stringify(existingPlans));
    
    // Retourner le plan créé
    return newPlan;
  } catch (error) {
    console.error('Erreur sauvegarde plan:', error);
    throw error;
  }
};

export const getMediaPlans = () => {
  try {
    const plans = JSON.parse(localStorage.getItem('mediaPlans') || '[]');
    return plans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Erreur chargement plans:', error);
    return [];
  }
};

export const deletePlanMedia = (planId) => {
  try {
    const plans = JSON.parse(localStorage.getItem('mediaPlans') || '[]');
    const filtered = plans.filter(p => p.id !== planId);
    localStorage.setItem('mediaPlans', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Erreur suppression plan:', error);
    return false;
  }
};

export const exportPlanAsJSON = (plan) => {
  const dataStr = JSON.stringify(plan, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `plan-media-${plan.clientMatricule}-${plan.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
