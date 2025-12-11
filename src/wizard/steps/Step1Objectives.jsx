import React, { useState } from 'react';
import { FormField, Card, Button } from '../../components';

/**
 * Étape 1: Objectifs et Cible
 * Saisie des objectifs marketing et de la cible démographique
 */
export default function Step1Objectives({ plan, onUpdate, onNext }) {
  const [objectives, setObjectives] = useState(plan.objectives || []);
  const [targetAge, setTargetAge] = useState(plan.targetAge || '25-40');
  const [targetCSP, setTargetCSP] = useState(plan.targetCSP || 'CSP+');
  const [region, setRegion] = useState(plan.region || 'corse-du-sud');
  const [errors, setErrors] = useState({});

  const objectiveOptions = [
    { value: 'notoriete', label: '📢 Notoriété (Brand Awareness)' },
    { value: 'trafic_web', label: '🌐 Trafic Web & Conversion' },
    { value: 'ventes', label: '💰 Génération de Ventes' },
    { value: 'leads', label: '📧 Génération de Leads' },
  ];

  const handleObjectiveToggle = (value) => {
    if (objectives.includes(value)) {
      setObjectives(objectives.filter(o => o !== value));
    } else {
      setObjectives([...objectives, value]);
    }
  };

  const handleNext = () => {
    const newErrors = {};

    if (objectives.length === 0) {
      newErrors.objectives = 'Sélectionnez au moins un objectif';
    }
    if (!targetAge) {
      newErrors.targetAge = 'Sélectionnez la cible d\'âge';
    }
    if (!targetCSP) {
      newErrors.targetCSP = 'Sélectionnez la CSP';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onUpdate({
      objectives,
      targetAge,
      targetCSP,
      region,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card title="🎯 Objectifs de Campagne">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {objectiveOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleObjectiveToggle(option.value)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                objectives.includes(option.value)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="font-semibold text-gray-800">{option.label}</div>
            </button>
          ))}
        </div>
        {errors.objectives && <p className="text-red-500 mt-2">{errors.objectives}</p>}
      </Card>

      <Card title="👥 Cible Démographique">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Tranche d'âge"
            type="select"
            value={targetAge}
            onChange={setTargetAge}
            options={[
              { value: '18-25', label: '18-25 ans' },
              { value: '25-40', label: '25-40 ans' },
              { value: '40-55', label: '40-55 ans' },
              { value: '55+', label: '55+ ans' },
              { value: 'tous', label: 'Tous les âges' },
            ]}
          />
          <FormField
            label="CSP"
            type="select"
            value={targetCSP}
            onChange={setTargetCSP}
            options={[
              { value: 'CSP+', label: 'CSP+' },
              { value: 'CSP-', label: 'CSP-' },
              { value: 'all', label: 'Tous publics' },
            ]}
          />
        </div>
      </Card>

      <Card title="📍 Zone Géographique">
        <FormField
          label="Région"
          type="select"
          value={region}
          onChange={setRegion}
          options={[
            { value: 'corse-du-sud', label: 'Corse-du-Sud' },
            { value: 'haute-corse', label: 'Haute-Corse' },
            { value: 'corse-pan', label: 'Corse (Pan-Insulaire)' },
          ]}
        />
        <p className="text-sm text-gray-600 mt-3">
          💡 Les données natives de nos supports sont déjà optimisées pour la Corse.
        </p>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button variant="primary" onClick={handleNext} className="w-full">
          Suivant: Budget →
        </Button>
      </div>
    </div>
  );
}
