import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Step1Campaign = ({ planData = {}, onUpdate, onNext }) => {
  const [sectors, setSectors] = useState([]);
  const [corseTownSelect, setCorseTownSelect] = useState('');
  const [formData, setFormData] = useState({
    clientName: planData.clientName || '',
    clientMatricule: planData.clientMatricule || '',
    campaignName: planData.campaignName || '',
    sector: planData.sector || '',
    diffusionStartDate: planData.diffusionStartDate || '',
    diffusionEndDate: planData.diffusionEndDate || '',
    diffusionDuration: planData.diffusionDuration || '',
    diffusionDurationType: planData.diffusionDurationType || 'weeks',
    region: planData.region || 'corse',
    microRegions: planData.microRegions || [],
    worldLocation: planData.worldLocation || '',
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
    'corse-du-sud': ['Ajaccio', 'Propriano', 'Sartène', 'Bonifacio', 'Corte', 'Autre localité'],
    'haute-corse': ['Bastia', 'Corte', 'Calvi', 'Balagne', 'Casinca', 'Autre localité'],
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


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Le nom du client est obligatoire';
    }
    if (!formData.clientMatricule.trim()) {
      newErrors.clientMatricule = 'Le matricule est obligatoire';
    }
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
    
    // Validation pour le mode Monde
    if (formData.region === 'monde' && !formData.worldLocation.trim()) {
      newErrors.worldLocation = 'Veuillez indiquer une localisation géographique';
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
          {/* Client et Matricule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
              <label className="block text-sm font-semibold text-corse-noir mb-2">
                Nom du client *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="ex: Boutique Corse, SARL Marketing..."
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                  errors.clientName
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-corse-rouge'
                }`}
              />
              {errors.clientName && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.clientName}
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
              <label className="block text-sm font-semibold text-corse-noir mb-2">
                Matricule client *
              </label>
              <input
                type="text"
                name="clientMatricule"
                value={formData.clientMatricule}
                onChange={handleInputChange}
                placeholder="ex: CLI-2025-001, SIRET..."
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                  errors.clientMatricule
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-corse-rouge'
                }`}
              />
              {errors.clientMatricule && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.clientMatricule}
                </p>
              )}
            </div>
          </div>

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
              {/* Choix Corse ou Monde */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, region: 'corse', worldLocation: '', microRegions: [] });
                    setCorseTownSelect('');
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition ${
                    formData.region === 'corse'
                      ? 'border-corse-rouge bg-red-50 text-corse-rouge'
                      : 'border-gray-300 bg-white text-corse-gris hover:border-corse-rouge'
                  }`}
                >
                  🇫🇷 En Corse
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, region: 'monde', microRegions: [] });
                    setCorseTownSelect('');
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition ${
                    formData.region === 'monde'
                      ? 'border-corse-rouge bg-red-50 text-corse-rouge'
                      : 'border-gray-300 bg-white text-corse-gris hover:border-corse-rouge'
                  }`}
                >
                  🌍 Ailleurs dans le monde
                </button>
              </div>

              {/* Mode Corse */}
              {formData.region === 'corse' && (
                <div className="space-y-4 pt-4 border-t">
                  <p className="text-xs font-medium text-corse-gris mb-3">
                    Sélectionnez les localités (optionnel)
                  </p>

                  {/* Villes principales */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-corse-noir uppercase">Villes principales</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Bastia', 'Ajaccio'].map(town => (
                        <button
                          key={town}
                          type="button"
                          onClick={() => {
                            if (formData.microRegions.includes(town)) {
                              setFormData({
                                ...formData,
                                microRegions: formData.microRegions.filter(r => r !== town)
                              });
                            } else {
                              setFormData({
                                ...formData,
                                microRegions: [...formData.microRegions, town]
                              });
                            }
                          }}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition text-sm ${
                            formData.microRegions.includes(town)
                              ? 'border-corse-rouge bg-red-50 text-corse-rouge'
                              : 'border-gray-300 bg-white text-corse-gris hover:border-corse-rouge'
                          }`}
                        >
                          {town}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Autres localités */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-corse-noir uppercase">Autres localités</p>
                    <div className="relative mb-2">
                      <select
                        value={corseTownSelect}
                        onChange={(e) => {
                          if (e.target.value) {
                            const town = e.target.value;
                            if (!formData.microRegions.includes(town)) {
                              setFormData({
                                ...formData,
                                microRegions: [...formData.microRegions, town]
                              });
                            }
                            setCorseTownSelect('');
                          }
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-corse-rouge focus:outline-none appearance-none"
                      >
                        <option value="">-- Ajouter une localité --</option>
                        <optgroup label="Villes principales">
                          <option value="Corte">Corte</option>
                          <option value="Calvi">Calvi</option>
                          <option value="Bonifacio">Bonifacio</option>
                          <option value="Porto-Vecchio">Porto-Vecchio</option>
                        </optgroup>
                        <optgroup label="Autres villes">
                          <option value="Île-Rousse">Île-Rousse</option>
                          <option value="Propriano">Propriano</option>
                          <option value="Sartène">Sartène</option>
                          <option value="Algajola">Algajola</option>
                          <option value="Lumio">Lumio</option>
                          <option value="Aléria">Aléria</option>
                          <option value="Macinaggio">Macinaggio</option>
                          <option value="Nonza">Nonza</option>
                        </optgroup>
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-corse-gris pointer-events-none" />
                    </div>
                  </div>

                  {/* Localités sélectionnées */}
                  {formData.microRegions.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-xs font-semibold text-blue-700 uppercase mb-2">Localités sélectionnées</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.microRegions.map(region => (
                          <button
                            key={region}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                microRegions: formData.microRegions.filter(r => r !== region)
                              });
                            }}
                            className="px-3 py-1 bg-blue-100 border-2 border-blue-400 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
                          >
                            ✓ {region} ✕
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Champs texte pour localité personnalisée */}
                  <div>
                    <label className="block text-xs font-medium text-corse-gris mb-2 uppercase">
                      Autre localité (texte libre)
                    </label>
                    <input
                      type="text"
                      name="corseCustomLocation"
                      value={formData.worldLocation}
                      onChange={(e) => {
                        setFormData({ ...formData, worldLocation: e.target.value });
                      }}
                      placeholder="Ex : Porto-Vecchio, Île-Rousse, zone côtière…"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-corse-rouge focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Mode Monde */}
              {formData.region === 'monde' && (
                <div className="pt-4 border-t">
                  <label className="block text-xs font-medium text-corse-gris mb-2">
                    Localisation géographique
                  </label>
                  <input
                    type="text"
                    name="worldLocation"
                    value={formData.worldLocation}
                    onChange={handleInputChange}
                    placeholder="ex: Paris, Lyon, Europe entière, Afrique du Nord..."
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                      errors.worldLocation
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-corse-rouge'
                    }`}
                  />
                  <p className="text-xs text-corse-gris-light mt-2">
                    💡 Saisissez le pays, la région ou le continent visé
                  </p>
                  {errors.worldLocation && (
                    <p className="text-red-600 text-sm mt-2">⚠️ {errors.worldLocation}</p>
                  )}
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
