import React, { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { getOffersForChannel, getPlacementsForMedia, createOfferFromPlacement } from '../utils/offersService';

const OffersSelector = ({ channel, onAddOffer }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [expandedMedia, setExpandedMedia] = useState(null);
  const offers = getOffersForChannel(channel);

  const toggleMediaExpand = (mediaId) => {
    setExpandedMedia(expandedMedia === mediaId ? null : mediaId);
  };

  const handleSelectPlacement = (mediaId, placementId) => {
    const offer = createOfferFromPlacement(channel, mediaId, placementId);
    if (offer) {
      onAddOffer(offer);
      setExpandedMedia(null);
      setSelectedMedia(null);
    }
  };

  const getChannelColor = (channel) => {
    const colors = {
      print: 'bg-amber-50 border-amber-300',
      digital: 'bg-blue-50 border-blue-300',
      social: 'bg-purple-50 border-purple-300',
      event: 'bg-green-50 border-green-300'
    };
    return colors[channel] || 'bg-gray-50 border-gray-300';
  };

  const getMediaColor = (channel) => {
    const colors = {
      print: 'bg-amber-100 hover:bg-amber-200 text-amber-900',
      digital: 'bg-blue-100 hover:bg-blue-200 text-blue-900',
      social: 'bg-purple-100 hover:bg-purple-200 text-purple-900',
      event: 'bg-green-100 hover:bg-green-200 text-green-900'
    };
    return colors[channel] || 'bg-gray-100 hover:bg-gray-200 text-gray-900';
  };

  const getButtonColor = (channel) => {
    const colors = {
      print: 'bg-amber-600 hover:bg-amber-700 text-white',
      digital: 'bg-blue-600 hover:bg-blue-700 text-white',
      social: 'bg-purple-600 hover:bg-purple-700 text-white',
      event: 'bg-green-600 hover:bg-green-700 text-white'
    };
    return colors[channel] || 'bg-gray-600 hover:bg-gray-700 text-white';
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getChannelColor(channel)}`}>
      <h5 className="font-semibold text-corse-noir mb-3 text-lg">
        Sélectionner des offres pré-configurées
      </h5>
      <p className="text-xs text-corse-gris-light mb-4">
        Cliquez sur une offre pour l'ajouter directement (les prix et specs sont pré-remplies)
      </p>

      <div className="space-y-2">
        {offers.map(media => (
          <div key={media.id}>
            {/* Media Header */}
            <button
              type="button"
              onClick={() => toggleMediaExpand(media.id)}
              className={`w-full text-left p-3 rounded-lg transition font-semibold flex items-center justify-between ${getMediaColor(channel)}`}
            >
              <div>
                <p>{media.mediaName}</p>
                <p className="text-xs font-normal opacity-75">{media.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                  {media.placements.length} offre(s)
                </span>
                <ChevronDown
                  size={18}
                  className={`transition ${expandedMedia === media.id ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {/* Placements List */}
            {expandedMedia === media.id && (
              <div className="bg-white rounded-lg border-2 border-dashed mt-2 p-3 space-y-2">
                {media.placements.map(placement => {
                  const specs = [];
                  if (placement.format) specs.push(placement.format);
                  if (placement.frequency) specs.push(placement.frequency);
                  if (placement.circulation) specs.push(`${placement.circulation.toLocaleString()} ex`);
                  if (placement.impressions) specs.push(`${(placement.impressions / 1000).toFixed(0)}K imp`);
                  if (placement.reach && typeof placement.reach === 'number') specs.push(`${placement.reach.toLocaleString()} reach`);

                  return (
                    <button
                      key={placement.id}
                      type="button"
                      onClick={() => handleSelectPlacement(media.id, placement.id)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded border border-gray-300 transition group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-corse-noir text-sm group-hover:text-corse-rouge transition">
                            {placement.placement}
                          </p>
                          <p className="text-xs text-corse-gris mt-1">
                            {specs.join(' • ')}
                          </p>
                        </div>
                        <p className="font-bold text-corse-rouge whitespace-nowrap ml-3">
                          {placement.unitPrice}€
                        </p>
                      </div>
                      {placement.notes && (
                        <p className="text-xs text-corse-gris-light italic">💡 {placement.notes}</p>
                      )}
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <Plus size={16} className="text-corse-rouge" />
                        <span className="text-xs font-semibold text-corse-rouge">Ajouter cette offre</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <p className="text-sm text-corse-gris-light italic text-center py-4">
          Aucune offre disponible pour ce canal
        </p>
      )}
    </div>
  );
};

export default OffersSelector;
