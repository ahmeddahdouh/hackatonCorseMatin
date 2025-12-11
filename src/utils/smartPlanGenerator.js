/**
 * Générateur automatique de plan média intelligent
 * Basé sur le scénario corse avec répartition 40% print / 60% digital
 */

export const generateSmartPlan = (
  objectives,
  targetAudience,
  budget,
  supportsPrices,
  allSupports,
  allFormats,
  allAudiences
) => {
  const plan = {
    objectives,
    targetAudience,
    budget,
    offers: [],
    totalBudget: 0,
    totalReach: 0,
    totalImpressions: 0,
    distribution: {
      print: 0,
      digital: 0,
      outdoor: 0,
      audio: 0,
      video: 0
    },
    kpis: {}
  };

  // Déterminer la répartition budgétaire selon objectives
  let printRatio = 0.40; // Default 40% print
  let digitalRatio = 0.60; // Default 60% digital

  if (objectives.includes("trafic_web")) {
    printRatio = 0.30;
    digitalRatio = 0.70;
  }

  const printBudget = budget * printRatio;
  const digitalBudget = budget * digitalRatio;

  // 1. PRINT: 2 demi-pages Corse-Matin
  const corseMatin = supportsPrices.find(
    p => p.supportId === "corse-matin" && p.formatId === "format_demi_page_corse_matin"
  );
  if (corseMatin) {
    const quantity = 2;
    const cost = corseMatin.pricePerUnit * quantity;
    const audience = allAudiences.find(a => a.supportId === "corse-matin");

    plan.offers.push({
      id: `offer_corsematin_${Date.now()}`,
      supportId: "corse-matin",
      supportName: "Corse-Matin",
      formatId: corseMatin.formatId,
      formatName: "Demi-Page",
      quantity,
      pricePerUnit: corseMatin.pricePerUnit,
      totalPrice: cost,
      reach: audience?.monthlyReach || 139000,
      impressions: audience?.monthlyImpressions || 556000,
      category: "print"
    });

    plan.totalBudget += cost;
    plan.totalReach += (audience?.monthlyReach || 139000) * quantity;
    plan.totalImpressions += (audience?.monthlyImpressions || 556000) * quantity;
    plan.distribution.print += cost;
  }

  // 2. DIGITAL: Habillage corsematin.com
  const corsematinWeb = supportsPrices.find(
    p => p.supportId === "corsematin-web" && p.formatId === "format_habillage_corsematin_web"
  );
  if (corsematinWeb) {
    const quantity = 7; // 7 jours
    const cost = corsematinWeb.pricePerUnit * quantity;
    const audience = allAudiences.find(a => a.supportId === "corsematin-web");

    plan.offers.push({
      id: `offer_corsematin_web_${Date.now()}`,
      supportId: "corsematin-web",
      supportName: "corsematin.com",
      formatId: corsematinWeb.formatId,
      formatName: "Habillage Homepage",
      quantity,
      pricePerUnit: corsematinWeb.pricePerUnit,
      totalPrice: cost,
      reach: audience?.monthlyReach || 850000,
      impressions: audience?.monthlyImpressions || 2500000,
      category: "digital"
    });

    plan.totalBudget += cost;
    plan.totalReach += (audience?.monthlyReach || 850000) * quantity;
    plan.totalImpressions += (audience?.monthlyImpressions || 2500000) * quantity;
    plan.distribution.digital += cost;
  }

  // 3. MOBILE: Smart Cover + Interstitiel Appli
  const appliSmartCover = supportsPrices.find(
    p => p.supportId === "appli-mobile-corsica" && p.formatId === "format_smart_cover_appli"
  );
  if (appliSmartCover) {
    const quantity = 7;
    const cost = appliSmartCover.pricePerUnit * quantity;
    const audience = allAudiences.find(a => a.supportId === "appli-mobile-corsica");

    plan.offers.push({
      id: `offer_appli_cover_${Date.now()}`,
      supportId: "appli-mobile-corsica",
      supportName: "Appli Corsica+",
      formatId: appliSmartCover.formatId,
      formatName: "Smart Cover",
      quantity,
      pricePerUnit: appliSmartCover.pricePerUnit,
      totalPrice: cost,
      reach: (audience?.monthlyReach || 280000) * 0.5,
      impressions: (audience?.monthlyImpressions || 400000) * 0.5,
      category: "mobile"
    });

    plan.totalBudget += cost;
    plan.totalReach += (audience?.monthlyReach || 280000) * 0.5;
    plan.totalImpressions += (audience?.monthlyImpressions || 400000) * 0.5;
    plan.distribution.digital += cost;
  }

  // 4. RÉSEAUX SOCIAUX: 2 posts sponsorisés Facebook + Instagram
  const facebookPost = supportsPrices.find(
    p => p.supportId === "facebook-corsica" && p.formatId === "format_post_facebook"
  );
  if (facebookPost) {
    const impressions = 50000; // 50K impressions
    const cost = (impressions / 1000) * facebookPost.pricePerUnit;
    const audience = allAudiences.find(a => a.supportId === "facebook-corsica");

    plan.offers.push({
      id: `offer_facebook_${Date.now()}`,
      supportId: "facebook-corsica",
      supportName: "Facebook Corse",
      formatId: facebookPost.formatId,
      formatName: "Post Sponsorisé",
      quantity: 2,
      pricePerUnit: facebookPost.pricePerUnit,
      totalPrice: cost,
      reach: (audience?.monthlyReach || 200000) * 0.25,
      impressions: impressions * 2, // 2 posts
      category: "social"
    });

    plan.totalBudget += cost;
    plan.totalReach += (audience?.monthlyReach || 200000) * 0.25;
    plan.totalImpressions += impressions * 2;
    plan.distribution.digital += cost;
  }

  // 5. INSTAGRAM Stories
  const instagramStory = supportsPrices.find(
    p => p.supportId === "instagram-corsica" && p.formatId === "format_story_instagram"
  );
  if (instagramStory) {
    const impressions = 40000;
    const cost = (impressions / 1000) * instagramStory.pricePerUnit;
    const audience = allAudiences.find(a => a.supportId === "instagram-corsica");

    plan.offers.push({
      id: `offer_instagram_${Date.now()}`,
      supportId: "instagram-corsica",
      supportName: "Instagram Corse",
      formatId: instagramStory.formatId,
      formatName: "Stories",
      quantity: 1,
      pricePerUnit: instagramStory.pricePerUnit,
      totalPrice: cost,
      reach: (audience?.monthlyReach || 135000) * 0.30,
      impressions,
      category: "social"
    });

    plan.totalBudget += cost;
    plan.totalReach += (audience?.monthlyReach || 135000) * 0.30;
    plan.totalImpressions += impressions;
    plan.distribution.digital += cost;
  }

  // Calculer KPIs
  plan.kpis = {
    cpmMoyen: plan.totalImpressions > 0 ? (plan.totalBudget / plan.totalImpressions) * 1000 : 0,
    reachTotal: Math.round(plan.totalReach),
    impressionsTotal: Math.round(plan.totalImpressions),
    impressionParContact: plan.totalReach > 0 ? (plan.totalImpressions / plan.totalReach).toFixed(2) : 0,
    budgetUtilise: Math.round(plan.totalBudget),
    budgetRestant: Math.round(budget - plan.totalBudget),
    printPercentage: ((plan.distribution.print / plan.totalBudget) * 100).toFixed(1),
    digitalPercentage: ((plan.distribution.digital / plan.totalBudget) * 100).toFixed(1)
  };

  return plan;
};

/**
 * Calculs détaillés pour le rapport
 */
export const calculatePlanStats = (plan) => {
  return {
    totalBudget: plan.totalBudget,
    totalReach: plan.totalReach,
    totalImpressions: plan.totalImpressions,
    averageCPM: ((plan.totalBudget / plan.totalImpressions) * 1000).toFixed(2),
    contactsPerEuro: (plan.totalReach / plan.totalBudget).toFixed(2),
    impressionsPerContact: (plan.totalImpressions / plan.totalReach).toFixed(2),
    frequency: (plan.totalImpressions / plan.totalReach).toFixed(2)
  };
};

/**
 * Optimiser le plan selon les contraintes
 */
export const optimizePlan = (plan, budget, targetReach, targetImpressions) => {
  let optimized = JSON.parse(JSON.stringify(plan));

  // Si on dépasse le budget, réduire proportionnellement
  if (optimized.totalBudget > budget) {
    const ratio = budget / optimized.totalBudget;
    optimized.offers.forEach(offer => {
      offer.totalPrice = Math.round(offer.totalPrice * ratio);
      offer.reach = Math.round(offer.reach * ratio);
      offer.impressions = Math.round(offer.impressions * ratio);
    });
    optimized.totalBudget = budget;
    optimized.totalReach = Math.round(optimized.totalReach * ratio);
    optimized.totalImpressions = Math.round(optimized.totalImpressions * ratio);
  }

  return optimized;
};
