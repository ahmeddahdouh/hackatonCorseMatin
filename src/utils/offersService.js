import offersDatabase from '../data/mediaOffers.json';

export const getOffersForChannel = (channel) => {
  const offers = offersDatabase.offers[channel] || [];
  return offers.map(media => ({
    ...media,
    placements: media.placements || []
  }));
};

export const getAllMediaByChannel = (channel) => {
  const offers = getOffersForChannel(channel);
  return offers.map(media => ({
    id: media.id,
    name: media.mediaName,
    category: media.category,
    placementCount: media.placements.length
  }));
};

export const getPlacementsForMedia = (channel, mediaId) => {
  const offers = getOffersForChannel(channel);
  const media = offers.find(m => m.id === mediaId);
  return media?.placements || [];
};

export const createOfferFromPlacement = (channel, mediaId, placementId) => {
  const offers = getOffersForChannel(channel);
  const media = offers.find(m => m.id === mediaId);
  const placement = media?.placements.find(p => p.id === placementId);

  if (!placement) return null;

  const baseOffer = {
    mediaName: media.mediaName,
    format: placement.format || '',
    placement: placement.placement || '',
    notes: placement.notes || ''
  };

  // Ajouter les champs spécifiques au canal
  if (channel === 'print') {
    return {
      ...baseOffer,
      circulation: placement.circulation || 0,
      unitPrice: placement.unitPrice || 0,
      quantity: 1,
      frequency: placement.frequency || '',
      budgetAllocated: placement.unitPrice || 0
    };
  }

  if (channel === 'digital') {
    return {
      ...baseOffer,
      impressions: placement.impressions || 0,
      unitPrice: placement.unitPrice || 0,
      quantity: 1,
      frequency: placement.frequency || '',
      budgetAllocated: placement.unitPrice || 0,
      cpm: placement.cpm || 0
    };
  }

  if (channel === 'social') {
    return {
      ...baseOffer,
      reach: placement.reach || placement.targetAudience || '',
      impressions: placement.impressions || 0,
      unitPrice: placement.unitPrice || 0,
      quantity: 1,
      frequency: placement.frequency || '',
      budgetAllocated: placement.unitPrice || 0,
      cpm: placement.cpm || 0,
      platform: placement.platform
    };
  }

  if (channel === 'event') {
    return {
      ...baseOffer,
      reach: placement.expectedVisitors || 0,
      unitPrice: placement.unitPrice || 0,
      quantity: 1,
      frequency: placement.frequency || '',
      budgetAllocated: placement.unitPrice || 0,
      contactPersons: placement.contactPersons || 0
    };
  }

  return baseOffer;
};
