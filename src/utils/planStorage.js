// Utility pour gérer la sauvegarde et chargement des plans media
export const savePlanMedia = (planData) => {
  try {
    // Récupérer les plans existants
    const existingPlans = JSON.parse(localStorage.getItem('mediaPlans') || '[]');
    
    // Créer un nouvel ID unique
    const newPlan = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      clientName: planData.clientName,
      clientMatricule: planData.clientMatricule,
      campaignName: planData.campaignName,
      sector: planData.sector,
      budget: planData.budget,
      objectives: planData.objectives,
      targets: {
        ageRanges: planData.ageRanges,
        gender: planData.gender,
        cspLevels: planData.cspLevels,
        interests: planData.interests,
        geographicTargets: planData.geographicTargets,
      },
      distribution: planData.effectiveDistribution || planData.distribution,
      kpis: planData.kpis || {
        estimatedReach: Math.round((planData.budget / 0.8) * 1000),
        estimatedImpressions: Math.round((planData.budget / 0.5) * 1000),
        estimatedCPM: (planData.budget / (Math.round((planData.budget / 0.5) * 1000) / 1000)).toFixed(2),
      },
      region: planData.region,
      microRegions: planData.microRegions,
      worldLocation: planData.worldLocation,
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
