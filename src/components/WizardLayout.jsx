import React from 'react'

export const WizardLayout = ({ 
  title, 
  subtitle = '', 
  children, 
  onNext, 
  onPrev, 
  nextDisabled = false,
  prevDisabled = false,
  nextLabel = 'Suivant',
  prevLabel = 'Précédent',
  showNavigation = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>

          <div className="mb-8">
            {children}
          </div>

          {showNavigation && (
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={onPrev}
                disabled={prevDisabled}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  prevDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {prevLabel}
              </button>
              <button
                onClick={onNext}
                disabled={nextDisabled}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors text-white ${
                  nextDisabled
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {nextLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
