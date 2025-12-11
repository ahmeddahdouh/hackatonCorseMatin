import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Step1Campaign = ({ planData = {}, onUpdate, onNext }) => {
  const [sectors, setSectors] = useState([]);
  const [formData, setFormData] = useState({
    campaignName: planData.campaignName || '',
    sector: planData.sector || '',
    diffusionStartDate: planData.diffusionStartDate || '',
    diffusionEndDate: planData.diffusionEndDate || '',
    diffusionDuration: planData.diffusionDuration || '',
    diffusionDurationType: planData.diffusionDurationType || 'weeks',
    region: planData.region || 'pan-insulaire',
    microRegions: planData.microRegions || [],
  });
  const [errors, setErrors] = useState({});

  // Charger secteurs depuis JSON
  useEffect(() => {
    fetch('/data/sectors.json')
      .then(res => res.json())
      .then(data => setSectors(data))
      .catch(err => console.error('Erreur chargement secteurs:', err));
  }, []);

  const microRegionOptions = {
    'corse-du-sud': ['Ajaccio', 'Taravo', 'Sartenais', 'Valinco'],
    'haute-corse': ['Bastia', 'Balagne', 'Casinca', 'Plaine orientale'],
    'pan-insulaire': ['Ensemble de la Corse'],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMicroRegionToggle = (region) => {
    setFormData(prev => ({
      ...prev,
      microRegions: prev.microRegions.includes(region)
        ? prev.microRegions.filter(r => r !== region)
        : [...prev.microRegions, region],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.campaignName.trim()) {
      newErrors.campaignName = 'Le nom de la campagne est obligatoire';
    }
    if (!formData.sector) {
      newErrors.sector = 'Le secteur d\'activité est obligatoire';
    }
    if (!formData.diffusionStartDate && !formData.diffusionDuration) {
      newErrors.diffusionStartDate = 'Veuillez indiquer une date ou une durée';
    }
    if (!formData.region) {
      newErrors.region = 'La zone géographique est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-corse-blanc to-gray-50 p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-corse-rouge rounded-full"></div>
            <h1 className="text-3xl font-bold text-corse-noir">NouvelleCampagne</h1>
          </div>
          <p className="text-corse-gris-light">Saisissez les informations générales de votre campagne</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom campagne */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <label className="block text-sm font-semibold text-corse-noir mb-2">
              Nom de la campagne *
            </label>
            <input
              type="text"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleInputChange}
              placeholder="ex: Printemps 2025, Soldes Juin..."
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                errors.campaignName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-corse-rouge'
              }`}
            />
            {errors.campaignName && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span> {errors.campaignName}
              </p>
            )}
          </div>

          {/* Secteur d'activité */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <label className="block text-sm font-semibold text-corse-noir mb-2">
              Secteur d'activité *
            </label>
            <div className="relative">
              <select
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none appearance-none transition ${
                  errors.sector
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-corse-rouge'
                }`}
              >
                <option value="">-- Sélectionner un secteur --</option>
                {sectors.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-corse-gris pointer-events-none" />
            </div>
            {errors.sector && (
              <p className="text-red-600 text-sm mt-2">⚠️ {errors.sector}</p>
            )}
          </div>

          {/* Période de diffusion */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <label className="block text-sm font-semibold text-corse-noir mb-4">
              Période de diffusion
            </label>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-corse-gris mb-2">
                  Par dates (optionnel)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="diffusionStartDate"
                    value={formData.diffusionStartDate}
                    onChange={handleInputChange}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-corse-rouge focus:outline-none"
                  />
                  <input
                    type="date"
                    name="diffusionEndDate"
                    value={formData.diffusionEndDate}
                    onChange={handleInputChange}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-corse-rouge focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-xs font-medium text-corse-gris mb-2">
                  Ou par durée (optionnel)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="diffusionDuration"
                    value={formData.diffusionDuration}
                    onChange={handleInputChange}
                    placeholder="ex: 4"
                    min="1"
                    className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-corse-rouge focus:outline-none"
                  />
                  <select
                    name="diffusionDurationType"
                    value={formData.diffusionDurationType}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-corse-rouge focus:outline-none"
                  >
                    <option value="weeks">semaines</option>
                    <option value="months">mois</option>
                  </select>
                </div>
              </div>
            </div>

            {errors.diffusionStartDate && (
              <p className="text-red-600 text-sm mt-2">⚠️ {errors.diffusionStartDate}</p>
            )}
          </div>

          {/* Zone géographique */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <label className="block text-sm font-semibold text-corse-noir mb-4">
              Zone géographique à couvrir *
            </label>

            <div className="space-y-4">
              <div className="relative">
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none appearance-none transition ${
                    errors.region
                      ? 'border-red-500'
                      : 'border-gray-200 focus:border-corse-rouge'
                  }`}
                >
                  <option value="corse-du-sud">Corse-du-Sud</option>
                  <option value="haute-corse">Haute-Corse</option>
                  <option value="pan-insulaire">Corse entière</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-corse-gris pointer-events-none" />
              </div>

              {/* Micro-régions */}
              {formData.region !== 'pan-insulaire' && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-corse-gris mb-3">
                    Ciblage micro-territorial (optionnel)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {microRegionOptions[formData.region].map(region => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => handleMicroRegionToggle(region)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition ${
                          formData.microRegions.includes(region)
                            ? 'border-corse-rouge bg-red-50 text-corse-rouge'
                            : 'border-gray-300 bg-white text-corse-gris hover:border-corse-rouge'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {errors.region && (
              <p className="text-red-600 text-sm mt-2">⚠️ {errors.region}</p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-corse-rouge to-red-700 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-md"
            >
              Continuer → Objectifs
            </button>
          </div>

          <p className="text-center text-xs text-corse-gris-light">
            * Champs obligatoires
          </p>
        </form>
      </div>
    </div>
  );
};

export default Step1Campaign;
