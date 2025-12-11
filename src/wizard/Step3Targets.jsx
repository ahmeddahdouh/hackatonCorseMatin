import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Step3Targets = ({ planData = {}, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    ageRanges: planData.ageRanges || [],
    gender: planData.gender || 'mixte',
    cspLevels: planData.cspLevels || [],
    interests: planData.interests || [],
    geographicTargets: planData.geographicTargets || [],
  });
  const [errors, setErrors] = useState({});

  const ageOptions = [
    { id: '15-24', label: '15-24 ans' },
    { id: '25-34', label: '25-34 ans' },
    { id: '35-49', label: '35-49 ans' },
    { id: '50-64', label: '50-64 ans' },
    { id: '65+', label: '65 ans et plus' },
  ];

  const genderOptions = [
    { id: 'mixte', label: 'Mixte (H/F)' },
    { id: 'H', label: 'Hommes' },
    { id: 'F', label: 'Femmes' },
  ];

  const cspOptions = [
    { id: 'csp+', label: 'CSP+ (Cadres, Professions Libérales)' },
    { id: 'csp-', label: 'CSP- (Employés, Ouvriers)' },
    { id: 'actifs', label: 'Actifs' },
    { id: 'retraites', label: 'Retraités' },
    { id: 'etudiants', label: 'Étudiants' },
  ];

  const interestOptions = [
    { id: 'conso-locale', label: 'Consommation locale' },
    { id: 'immobilier', label: 'Immobilier' },
    { id: 'automobile', label: 'Automobile' },
    { id: 'sante', label: 'Santé / Bien-être' },
    { id: 'tourisme', label: 'Tourisme' },
    { id: 'shopping', label: 'Shopping / Mode' },
    { id: 'finance', label: 'Finance / Assurance' },
    { id: 'tech', label: 'Technologie' },
  ];

  const geographicOptions = [
    { id: 'urbain', label: 'Zones urbaines' },
    { id: 'semi-urbain', label: 'Zones semi-urbaines' },
    { id: 'rural', label: 'Zones rurales' },
    { id: 'tout', label: 'Tout Territoire' },
  ];

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.ageRanges.length === 0) {
      newErrors.ageRanges = 'Veuillez sélectionner au moins une tranche d\'âge';
    }
    if (formData.cspLevels.length === 0) {
      newErrors.cspLevels = 'Veuillez sélectionner au moins une CSP';
    }
    if (formData.geographicTargets.length === 0) {
      newErrors.geographicTargets = 'Veuillez sélectionner une zone géographique';
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

  const handleBack = () => {
    onUpdate(formData);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-corse-blanc to-gray-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-corse-rouge rounded-full"></div>
            <h1 className="text-3xl font-bold text-corse-noir">Définir les Cibles</h1>
          </div>
          <p className="text-corse-gris-light">Précisez les critères démographiques et comportementaux de votre audience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tranches d'âge */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <h3 className="text-lg font-semibold text-corse-noir mb-4">
              Tranches d'âge *
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ageOptions.map(age => (
                <button
                  key={age.id}
                  type="button"
                  onClick={() => toggleArrayField('ageRanges', age.id)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                    formData.ageRanges.includes(age.id)
                      ? 'border-corse-rouge bg-red-50 text-corse-rouge'
                      : 'border-gray-300 bg-white text-corse-gris hover:border-corse-rouge'
                  }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
            {errors.ageRanges && (
              <p className="text-red-600 text-sm mt-2">⚠️ {errors.ageRanges}</p>
            )}
          </div>

          {/* Sexe */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <h3 className="text-lg font-semibold text-corse-noir mb-4">Sexe</h3>
            <div className="grid grid-cols-3 gap-3">
              {genderOptions.map(gen => (
                <button
                  key={gen.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, gender: gen.id }))}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                    formData.gender === gen.id
                      ? 'border-corse-rouge bg-red-50 text-corse-rouge'
                      : 'border-gray-300 bg-white text-corse-gris hover:border-corse-rouge'
                  }`}
                >
                  {gen.label}
                </button>
              ))}
            </div>
          </div>

          {/* CSP */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <h3 className="text-lg font-semibold text-corse-noir mb-4">
              Catégories Socio-Professionnelles *
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cspOptions.map(csp => (
                <button
                  key={csp.id}
                  type="button"
                  onClick={() => toggleArrayField('cspLevels', csp.id)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition text-sm ${
                    formData.cspLevels.includes(csp.id)
                      ? 'border-corse-rouge bg-red-50 text-corse-rouge'
                      : 'border-gray-300 bg-white text-corse-gris hover:border-corse-rouge'
                  }`}
                >
                  {csp.label}
                </button>
              ))}
            </div>
            {errors.cspLevels && (
              <p className="text-red-600 text-sm mt-2">⚠️ {errors.cspLevels}</p>
            )}
          </div>

          {/* Intérêts comportementaux */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-gris shadow-sm">
            <h3 className="text-lg font-semibold text-corse-noir mb-3">
              Intérêts / Affinités (optionnel)
            </h3>
            <p className="text-sm text-corse-gris-light mb-4">
              Sélectionnez les domaines qui correspondent à votre audience
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interestOptions.map(interest => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleArrayField('interests', interest.id)}
                  className={`px-3 py-2 rounded-lg border-2 font-medium transition text-sm ${
                    formData.interests.includes(interest.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-corse-gris hover:border-blue-500'
                  }`}
                >
                  {interest.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cibles géographiques */}
          <div className="bg-white rounded-lg p-6 border-l-4 border-corse-rouge shadow-sm">
            <h3 className="text-lg font-semibold text-corse-noir mb-4">
              Zones géographiques *
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {geographicOptions.map(geo => (
                <button
                  key={geo.id}
                  type="button"
                  onClick={() => toggleArrayField('geographicTargets', geo.id)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition text-sm ${
                    formData.geographicTargets.includes(geo.id)
                      ? 'border-corse-rouge bg-red-50 text-corse-rouge'
                      : 'border-gray-300 bg-white text-corse-gris hover:border-corse-rouge'
                  }`}
                >
                  {geo.label}
                </button>
              ))}
            </div>
            {errors.geographicTargets && (
              <p className="text-red-600 text-sm mt-2">⚠️ {errors.geographicTargets}</p>
            )}
          </div>

          {/* Résumé cibles */}
          {(formData.ageRanges.length > 0 || formData.cspLevels.length > 0) && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700 font-medium mb-2">Profil cible résumé:</p>
              <div className="text-sm text-green-700 space-y-1">
                <p>
                  🎯 Âges: {ageOptions
                    .filter(a => formData.ageRanges.includes(a.id))
                    .map(a => a.label)
                    .join(', ')}
                </p>
                <p>
                  👥 CSP: {cspOptions
                    .filter(c => formData.cspLevels.includes(c.id))
                    .map(c => c.label.split('(')[0].trim())
                    .join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 border-2 border-corse-gris text-corse-noir font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              ← Retour
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-corse-rouge to-red-700 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-md"
            >
              Continuer → Budget
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

export default Step3Targets;
