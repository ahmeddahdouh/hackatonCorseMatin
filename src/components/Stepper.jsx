import React from 'react'
import { Button } from './Button'

export const Stepper = ({ steps, currentStep, onStepChange }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex flex-col items-center cursor-pointer transition-colors`}
              onClick={() => onStepChange && onStepChange(index)}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <p className={`text-sm mt-2 font-medium text-center max-w-24 ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 mb-8 transition-colors ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
