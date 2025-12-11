import React, { useState } from 'react';
import Step1Campaign from './Step1Campaign';
import Step2Objectives from './Step2Objectives';
import Step3Targets from './Step3Targets';
import Step4Budget from './Step4Budget';

const steps = ['Campagne', 'Objectifs', 'Cibles', 'Budget'];

export const Wizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [planData, setPlanData] = useState({
    campaignName: '',
    sector: '',
    objectives: [],
    ageRanges: [],
    cspLevels: [],
    budget: 15000,
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed
      onComplete && onComplete(planData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlanUpdate = (data) => {
    setPlanData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1Campaign
            planData={planData}
            onUpdate={handlePlanUpdate}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <Step2Objectives
            planData={planData}
            onUpdate={handlePlanUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <Step3Targets
            planData={planData}
            onUpdate={handlePlanUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step4Budget
            planData={planData}
            onUpdate={handlePlanUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const stepTitles = {
    0: '📋 Nouvelle Campagne',
    1: '🎯 Objectifs',
    2: '👥 Cibles',
    3: '💰 Budget',
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Barre de progression */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-corse-rouge to-red-700 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Indicateur d'étapes */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 pt-6 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition ${
                    index <= currentStep
                      ? index === currentStep
                        ? 'bg-corse-rouge text-white shadow-lg'
                        : 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </button>
                <div className="ml-3 flex-1">
                  <p className="text-xs font-semibold text-corse-noir uppercase tracking-wide">
                    {step}
                  </p>
                  <p className="text-xs text-corse-gris-light">
                    Étape {index + 1}/{steps.length}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full transition ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu étape */}
      <div className="pt-8 pb-8">
        {renderStep()}
      </div>
    </div>
  );
};
