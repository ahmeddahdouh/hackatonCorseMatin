import React, { useState } from 'react';

const Step2Objectives = ({ planData = {}, onUpdate, onNext, onBack }) => {
  const [selectedObjectives, setSelectedObjectives] = useState(
    planData.objectives || []
  );
  const [errors, setErrors] = useState({});

  const objectives = [
    {
      id: 'notoriete',
      name: 'Notoriété',
      description: 'Faire connaître la marque ou le produit',
      icon: '🎯',
    },
    {
      id: 'image',
      name: 'Image / Branding',
      description: 'Améliorer la perception, valoriser un message clé',
      icon: '✨',
    },
    {
      id: 'drive-to-store',
      name: 'Drive-to-Store',
      description: 'Générer du trafic en magasin',
      icon: '🛍️',
    },
    {
      id: 'trafic-web',
      name: 'Trafic Web / E-commerce',
      description: 'Augmenter les visites et conversions en ligne',
      icon: '💻',
    },
    {
      id: 'lancement',
      name: 'Lancement Produit / Événement',
      description: 'Annoncer un nouveau produit ou événement',
      icon: '🚀',
    },
    {
      id: 'fidelisation',
      name: 'Fidélisation / Engagement',
      description: 'Fidéliser clients existants et augmenter engagement',
      icon: '❤️',
    },
  ];

  const toggleObjective = (objectiveId) => {
    setSelectedObjectives(prev =>
      prev.includes(objectiveId)
        ? prev.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    );
    if (errors.objectives) {
      setErrors(prev => ({ ...prev, objectives: '' }));
    }
  };

  const validateForm = () => {
    if (selectedObjectives.length === 0) {
      setErrors({ objectives: 'Veuillez sélectionner au moins un objectif' });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate({ objectives: selectedObjectives });
      onNext();
    }
  };

  const handleBack = () => {
    onUpdate({ objectives: selectedObjectives });
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-corse-blanc to-gray-50 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-corse-rouge rounded-full"></div>
            <h1 className="text-3xl font-bold text-corse-noir">Objectifs de Communication</h1>
          </div>
          <p className="text-corse-gris-light">Sélectionnez un ou plusieurs objectifs (multi-choix)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grille objectifs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {objectives.map(objective => (
              <button
                key={objective.id}
                type="button"
                onClick={() => toggleObjective(objective.id)}
                className={`text-left p-6 rounded-lg border-2 transition transform hover:scale-105 ${
                  selectedObjectives.includes(objective.id)
                    ? 'border-corse-rouge bg-gradient-to-br from-red-50 to-red-100 shadow-md'
                    : 'border-gray-300 bg-white hover:border-corse-rouge'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{objective.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-corse-noir mb-1">
                      {objective.name}
                    </h3>
                    <p className="text-sm text-corse-gris-light">
                      {objective.description}
                    </p>
                    {selectedObjectives.includes(objective.id) && (
                      <div className="mt-3 flex items-center gap-2 text-corse-rouge font-semibold text-sm">
                        <span>✓ Sélectionné</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Message d'erreur */}
          {errors.objectives && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 flex items-center gap-2">
                <span>⚠️</span> {errors.objectives}
              </p>
            </div>
          )}

          {/* Résumé sélection */}
          {selectedObjectives.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-700 font-medium mb-2">
                {selectedObjectives.length} objectif(s) sélectionné(s):
              </p>
              <div className="flex flex-wrap gap-2">
                {objectives
                  .filter(obj => selectedObjectives.includes(obj.id))
                  .map(obj => (
                    <span
                      key={obj.id}
                      className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {obj.icon} {obj.name}
                    </span>
                  ))}
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
              Continuer → Cibles
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2Objectives;
