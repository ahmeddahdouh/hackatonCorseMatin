/**
 * Ajuste les offres en fonction d'un nouveau budget
 * Redimensionne les quantités et budgets proportionnellement
 */
export const adjustOffersForBudget = (offers, oldBudget, newBudget) => {
  if (!offers || offers.length === 0) return offers;
  if (oldBudget === 0) return offers;

  const ratio = newBudget / oldBudget;

  return offers.map(offer => {
    const adjustedOffer = { ...offer };

    // Ajuster le budget alloué
    if (adjustedOffer.budgetAllocated) {
      adjustedOffer.budgetAllocated = Math.round(
        adjustedOffer.budgetAllocated * ratio
      );
    }

    // Ajuster la quantité si elle existe
    if (adjustedOffer.quantity) {
      adjustedOffer.quantity = Math.max(
        1,
        Math.round(adjustedOffer.quantity * ratio)
      );
    }

    return adjustedOffer;
  });
};

/**
 * Calcule le budget total utilisé par toutes les offres dans tous les canaux
 */
export const calculateTotalOffersValue = (channelDetails) => {
  let total = 0;

  Object.values(channelDetails || {}).forEach(channel => {
    const offers = channel?.selectedOffers || [];
    offers.forEach(offer => {
      total += offer.budgetAllocated || 0;
    });
  });

  return total;
};

/**
 * Ajuste TOUTES les offres de TOUS les canaux pour un nouveau budget global
 */
export const adjustAllChannelsForBudget = (channelDetails, oldBudget, newBudget) => {
  if (!channelDetails) return channelDetails;

  const totalOffersValue = calculateTotalOffersValue(channelDetails);
  if (totalOffersValue === 0) return channelDetails;

  // Ratio d'ajustement basé sur le nouveau budget vs l'ancien
  const ratio = newBudget / oldBudget;

  const adjustedChannelDetails = {};

  Object.entries(channelDetails).forEach(([channel, details]) => {
    const offers = details?.selectedOffers || [];

    adjustedChannelDetails[channel] = {
      ...details,
      selectedOffers: offers.map(offer => {
        const adjustedOffer = { ...offer };

        // Ajuster le budget alloué proportionnellement
        if (adjustedOffer.budgetAllocated) {
          adjustedOffer.budgetAllocated = Math.round(
            adjustedOffer.budgetAllocated * ratio
          );
        }

        // Ajuster la quantité
        if (adjustedOffer.quantity && adjustedOffer.quantity > 1) {
          const newQuantity = Math.round(adjustedOffer.quantity * ratio);
          adjustedOffer.quantity = Math.max(1, newQuantity);
        }

        // Ajuster les impressions si elles existent (pour digital)
        if (adjustedOffer.impressions) {
          adjustedOffer.impressions = Math.round(
            adjustedOffer.impressions * ratio
          );
        }

        return adjustedOffer;
      })
    };
  });

  return adjustedChannelDetails;
};

/**
 * Optimise les offres pour tenir dans le nouveau budget
 * Réduit les quantités plutôt que de supprimer des offres
 */
export const optimizeOffersForBudget = (offers, newBudget) => {
  if (!offers || offers.length === 0) return offers;

  let totalBudget = offers.reduce((sum, offer) => sum + (offer.budgetAllocated || 0), 0);

  if (totalBudget <= newBudget) {
    return offers; // Déjà dans le budget
  }

  // Réduire les quantités pour tenir dans le budget
  const ratio = newBudget / totalBudget;
  const optimized = offers.map(offer => {
    const adjustedOffer = { ...offer };

    if (adjustedOffer.quantity && adjustedOffer.quantity > 1) {
      const newQuantity = Math.max(1, Math.floor(adjustedOffer.quantity * ratio));
      adjustedOffer.quantity = newQuantity;

      // Recalculer le budget en fonction de la nouvelle quantité
      if (adjustedOffer.unitPrice) {
        adjustedOffer.budgetAllocated = adjustedOffer.unitPrice * newQuantity;
      }
    } else {
      // Si quantité = 1, réduire le budget alloué
      adjustedOffer.budgetAllocated = Math.round(
        adjustedOffer.budgetAllocated * ratio
      );
    }

    return adjustedOffer;
  });

  return optimized;
};
