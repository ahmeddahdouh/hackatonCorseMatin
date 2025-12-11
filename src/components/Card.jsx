import React from 'react'

export const Card = ({ children, className = '', title = null, icon = null }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-100 p-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          {icon && <span className="text-2xl">{icon}</span>}
          {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
        </div>
      )}
      {children}
    </div>
  )
}

export const CardGrid = ({ children, cols = 3 }) => {
  const colClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid gap-6 ${colClass[cols]}`}>
      {children}
    </div>
  )
}
