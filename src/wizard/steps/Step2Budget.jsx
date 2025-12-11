import React, { useState } from 'react';
import { FormField, Card, Button } from '../../components';

/**
 * Étape 2: Budget
 * Saisie du budget de campagne
 */
export default function Step2Budget({ plan, onUpdate, onNext }) {
  const [budget, setBudget] = useState(plan.budget || 15000);
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {};

    if (!budget || budget < 1000) {
      newErrors.budget = 'Le budget minimum est 1 000 €';
    }
    if (budget > 500000) {
      newErrors.budget = 'Le budget maximum est 500 000 €';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onUpdate({ budget: parseFloat(budget) });
    onNext();
  };

  const budgetTemplates = [
    { label: 'Petit Budget', value: 5000 },
    { label: 'Budget Moyen', value: 15000 },
    { label: 'Budget Important', value: 30000 },
    { label: 'Budget Premium', value: 50000 },
  ];

  return (
    <div className="space-y-6">
      <Card title="💰 Budget de Campagne">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Saisissez votre budget total (€)
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-semibold"
            min="1000"
            max="500000"
            step="500"
          />
          {errors.budget && <p className="text-red-500 mt-2">{errors.budget}</p>}
          <p className="text-3xl font-bold text-blue-600 mt-4">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(budget)}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-600 mb-3">Modèles rapides :</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {budgetTemplates.map(template => (
              <button
                key={template.value}
                onClick={() => setBudget(template.value)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  parseFloat(budget) === template.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card title="📊 Répartition Type">
        <div className="space-y-2 text-sm">
          <p>
            <strong>40% Print</strong> (Corse-Matin, affichage) = <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(budget * 0.40)}</strong>
          </p>
          <p>
            <strong>60% Digital</strong> (Web, Mobile, Réseaux Sociaux) = <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(budget * 0.60)}</strong>
          </p>
        </div>
      </Card>

      <Card title="💡 Conseil">
        <p className="text-sm text-gray-700">
          Pour une campagne optimale en Corse :
          <br />• Budget minimum: <strong>5 000 €</strong> (sensibilisation locale)
          <br />• Budget recommandé: <strong>15 000 €</strong> (campagne équilibrée)
          <br />• Budget premium: <strong>30 000 €+</strong> (impact maximum)
        </p>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button variant="secondary" onClick={() => onUpdate({})} className="w-full">
          ← Retour
        </Button>
        <Button variant="primary" onClick={handleNext} className="w-full">
          Générer Plan →
        </Button>
      </div>
    </div>
  );
}
