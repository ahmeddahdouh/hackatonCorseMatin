// Calcul du prix total
export const calculatePrice = (priceObj, quantity) => {
  if (!priceObj) return 0
  
  if (priceObj.unit === 'CPM') {
    // Pour CPM, la quantité est en impressions
    return Math.ceil((quantity / 1000) * priceObj.pricePerUnit)
  }
  
  // Pour les unités standards (insertion, spot, etc.)
  return priceObj.pricePerUnit * quantity
}

// Calcul du reach/impressions
export const calculateAudience = (audienceObj, frequency = 1) => {
  if (!audienceObj) return 0
  return audienceObj.monthlyReach * frequency
}

// Calcul des impressions
export const calculateImpressions = (audienceObj, frequency = 1) => {
  if (!audienceObj) return 0
  return audienceObj.monthlyImpressions * frequency
}

// Formatage devise
export const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Formatage nombres
export const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

// Calcul du CPM effectif
export const calculateEffectiveCPM = (totalPrice, impressions) => {
  if (impressions === 0) return 0
  return (totalPrice / impressions) * 1000
}

// Grouper les données par clé
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const groupKey = item[key]
    if (!acc[groupKey]) acc[groupKey] = []
    acc[groupKey].push(item)
    return acc
  }, {})
}

// Calculer les statistiques du plan
export const calculatePlanStats = (plan, priceData, audienceData) => {
  let totalBudget = 0
  let totalReach = 0
  let totalImpressions = 0
  const offersBySupport = {}
  const offersByFormat = {}

  plan.offers?.forEach(offer => {
    totalBudget += offer.totalPrice || 0
    totalReach += offer.reach || 0
    totalImpressions += offer.impressions || 0

    // Grouper par support
    if (!offersBySupport[offer.supportName]) {
      offersBySupport[offer.supportName] = { budget: 0, reach: 0, count: 0 }
    }
    offersBySupport[offer.supportName].budget += offer.totalPrice || 0
    offersBySupport[offer.supportName].reach += offer.reach || 0
    offersBySupport[offer.supportName].count += 1

    // Grouper par format
    if (!offersByFormat[offer.formatName]) {
      offersByFormat[offer.formatName] = { budget: 0, reach: 0, count: 0 }
    }
    offersByFormat[offer.formatName].budget += offer.totalPrice || 0
    offersByFormat[offer.formatName].reach += offer.reach || 0
    offersByFormat[offer.formatName].count += 1
  })

  return {
    totalBudget,
    totalReach,
    totalImpressions,
    offerCount: plan.offers?.length || 0,
    offersBySupport,
    offersByFormat,
  }
}
