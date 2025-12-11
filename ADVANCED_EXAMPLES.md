# 🎨 Exemples de Code Avancés

## Extension 1 : Ajouter un calcul de ROI

### Nouveau hook
```javascript
// src/hooks/useROICalculator.js

export const useROICalculator = () => {
  const calculateROI = (totalBudget, totalReach, conversionRate = 0.01) => {
    // Supposons que 1% de la reach se convertit en vente
    const estimatedConversions = totalReach * conversionRate
    const estimatedRevenue = estimatedConversions * 100 // 100€ par conversion moyenne
    const roi = ((estimatedRevenue - totalBudget) / totalBudget) * 100
    
    return {
      estimatedConversions,
      estimatedRevenue,
      roi: roi.toFixed(2),
      profitable: roi > 0
    }
  }

  const calculateCPL = (totalBudget, totalReach) => {
    // Coût par Lead
    return (totalBudget / totalReach).toFixed(4)
  }

  return { calculateROI, calculateCPL }
}
```

### Utilisation dans le Dashboard
```jsx
import { useROICalculator } from '../hooks/useROICalculator'

export const Dashboard = () => {
  const { calculateROI } = useROICalculator()
  const { totalBudgetAllPlans, totalAudienceAllPlans } = useMediaPlan()

  const roi = calculateROI(totalBudgetAllPlans, totalAudienceAllPlans)

  return (
    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
      <h3 className="text-sm font-medium opacity-90">ROI Estimé</h3>
      <p className={`text-3xl font-bold mt-2 ${roi.profitable ? 'text-green-300' : 'text-red-300'}`}>
        {roi.roi}%
      </p>
      <p className="text-xs opacity-75 mt-1">{roi.estimatedConversions} conversions</p>
    </Card>
  )
}
```

---

## Extension 2 : Système de Templates

### Nouveau fichier de templates
```javascript
// src/utils/templates.js

export const TEMPLATES = {
  'budget-low': {
    name: 'Budget Réduit',
    description: 'Plan pour petit budget',
    supports: ['web_portal', 'social_media'],
    formats: ['format_banner_300', 'format_social_feed']
  },
  'budget-medium': {
    name: 'Budget Moyen',
    description: 'Plan classique',
    supports: ['press_daily', 'web_portal', 'social_media', 'display_net'],
    formats: ['format_full_page', 'format_banner_728', 'format_social_feed']
  },
  'budget-high': {
    name: 'Budget Premium',
    description: 'Plan complet multi-médias',
    supports: ['press_daily', 'press_weekly', 'web_portal', 'app_news', 'social_media', 'video_streaming'],
    formats: ['format_full_page', 'format_banner_728', 'format_banner_300', 'format_video_30', 'format_social_feed']
  }
}

export const applyTemplate = (templateId, currentPlan) => {
  const template = TEMPLATES[templateId]
  if (!template) return currentPlan

  return {
    ...currentPlan,
    selectedSupports: template.supports.map((supportId, idx) => ({
      supportId,
      formatId: template.formats[idx] || null,
      quantity: 1
    }))
  }
}
```

### Composant d'utilisation des templates
```jsx
// src/components/TemplateSelector.jsx

export const TemplateSelector = ({ onSelectTemplate }) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Démarrez avec un template pré-configuré :</p>
      
      {Object.entries(TEMPLATES).map(([id, template]) => (
        <Card
          key={id}
          className="cursor-pointer hover:border-blue-600"
          onClick={() => onSelectTemplate(id)}
        >
          <h3 className="font-bold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
          <p className="text-xs text-blue-600 mt-2">
            {template.supports.length} supports · {template.formats.length} formats
          </p>
        </Card>
      ))}
    </div>
  )
}
```

---

## Extension 3 : Comparateur de Plans

### Composant comparateur
```jsx
// src/components/PlanComparator.jsx

export const PlanComparator = ({ plans = [], limit = 3 }) => {
  const [selectedPlanIds, setSelectedPlanIds] = React.useState([])

  const togglePlan = (id) => {
    setSelectedPlanIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const selectedPlans = plans.filter(p => selectedPlanIds.includes(p.id))

  return (
    <div>
      {/* Sélection des plans à comparer */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {plans.map(plan => (
          <Card
            key={plan.id}
            className={`cursor-pointer border-2 ${
              selectedPlanIds.includes(plan.id)
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200'
            }`}
            onClick={() => togglePlan(plan.id)}
          >
            <h3 className="font-bold text-gray-900">{plan.planName}</h3>
            <p className="text-sm text-gray-600">{plan.clientName}</p>
            <p className="text-lg font-bold text-blue-600 mt-2">
              {plan.totalBudget.toLocaleString('fr-FR')}€
            </p>
          </Card>
        ))}
      </div>

      {/* Tableau comparatif */}
      {selectedPlans.length > 0 && (
        <Card title="Comparaison détaillée" className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Critère</th>
                {selectedPlans.map(plan => (
                  <th key={plan.id} className="px-4 py-2 text-right font-semibold">
                    {plan.planName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Budget Total</td>
                {selectedPlans.map(plan => (
                  <td key={plan.id} className="px-4 py-2 text-right">
                    {plan.totalBudget.toLocaleString('fr-FR')}€
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Audience Totale</td>
                {selectedPlans.map(plan => (
                  <td key={plan.id} className="px-4 py-2 text-right">
                    {(plan.totalAudience / 1000000).toFixed(2)}M
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Nombre d'Offres</td>
                {selectedPlans.map(plan => (
                  <td key={plan.id} className="px-4 py-2 text-right">
                    {plan.offers?.length || 0}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">CPM Effectif</td>
                {selectedPlans.map(plan => {
                  const totalImpressions = plan.offers?.reduce((sum, o) => sum + (o.impressions || 0), 0) || 1
                  const cpm = (plan.totalBudget / totalImpressions) * 1000
                  return (
                    <td key={plan.id} className="px-4 py-2 text-right">
                      {cpm.toFixed(2)}€
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
```

---

## Extension 4 : Export CSV des Plans

### Fonction d'export
```javascript
// src/utils/exporters.js

export const exportPlansToCSV = (plans) => {
  const headers = [
    'Plan Name',
    'Client',
    'Type',
    'Budget',
    'Audience',
    'Offers Count',
    'Created Date'
  ]

  const rows = plans.map(plan => [
    plan.planName,
    plan.clientName,
    plan.clientType,
    plan.totalBudget,
    plan.totalAudience,
    plan.offers?.length || 0,
    new Date(plan.createdAt).toLocaleDateString('fr-FR')
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  // Télécharger le fichier
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `plans-media-${Date.now()}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

export const exportOfferDetailsToCSV = (plan) => {
  const headers = [
    'Support',
    'Format',
    'Quantity',
    'Price Per Unit',
    'Total Price',
    'Reach'
  ]

  const rows = plan.offers.map(offer => [
    offer.supportName,
    offer.formatName,
    offer.quantity,
    offer.totalPrice / offer.quantity,
    offer.totalPrice,
    offer.reach
  ])

  const csv = [
    `Plan: ${plan.planName}`,
    `Client: ${plan.clientName}`,
    `Date: ${new Date(plan.createdAt).toLocaleDateString('fr-FR')}`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `offres-${plan.planName}-${Date.now()}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
```

### Boutons d'export
```jsx
<Button variant="secondary" size="sm" onClick={() => exportPlansToCSV(savedPlans)}>
  📥 Exporter en CSV
</Button>

<Button variant="secondary" size="sm" onClick={() => exportOfferDetailsToCSV(currentPlan)}>
  📊 Exporter les offres
</Button>
```

---

## Extension 5 : Filtrages et Recherche Avancée

### Hook de filtrage
```javascript
// src/hooks/useFilteredPlans.js

export const useFilteredPlans = (plans) => {
  const [filters, setFilters] = React.useState({
    clientType: '',
    minBudget: 0,
    maxBudget: Infinity,
    minAudience: 0,
    maxAudience: Infinity,
    searchTerm: ''
  })

  const filteredPlans = plans.filter(plan => {
    // Filtre par type client
    if (filters.clientType && plan.clientType !== filters.clientType) {
      return false
    }

    // Filtre par budget
    if (plan.totalBudget < filters.minBudget || plan.totalBudget > filters.maxBudget) {
      return false
    }

    // Filtre par audience
    if (plan.totalAudience < filters.minAudience || plan.totalAudience > filters.maxAudience) {
      return false
    }

    // Recherche par texte
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      return (
        plan.planName.toLowerCase().includes(term) ||
        plan.clientName.toLowerCase().includes(term)
      )
    }

    return true
  })

  return { filteredPlans, filters, setFilters }
}
```

### Utilisation dans Dashboard
```jsx
const { filteredPlans, filters, setFilters } = useFilteredPlans(savedPlans)

return (
  <div className="space-y-4">
    {/* Barre de filtrage */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FormField
        label="Rechercher"
        type="text"
        value={filters.searchTerm}
        onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        placeholder="Plan ou client"
      />
      <FormField
        label="Type client"
        type="select"
        value={filters.clientType}
        onChange={(e) => setFilters({ ...filters, clientType: e.target.value })}
      >
        <option value="">Tous</option>
        <option value="B2C">B2C</option>
        <option value="B2B">B2B</option>
      </FormField>
      <FormField
        label="Budget min"
        type="number"
        value={filters.minBudget}
        onChange={(e) => setFilters({ ...filters, minBudget: parseInt(e.target.value) })}
      />
      <FormField
        label="Budget max"
        type="number"
        value={filters.maxBudget}
        onChange={(e) => setFilters({ ...filters, maxBudget: parseInt(e.target.value) })}
      />
    </div>

    {/* Plans filtrés */}
    <Card title={`Plans trouvés: ${filteredPlans.length}`}>
      {/* Tableau des plans */}
    </Card>
  </div>
)
```

---

## Extension 6 : Mode Sombre

### Hook personnalisé
```javascript
// src/hooks/useDarkMode.js

export const useDarkMode = () => {
  const [isDark, setIsDark] = React.useState(() => {
    const stored = localStorage.getItem('darkMode')
    return stored ? JSON.parse(stored) : false
  })

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark))
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return { isDark, toggleDarkMode: () => setIsDark(!isDark) }
}
```

### Utilisation dans App
```jsx
export const App = () => {
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <div className={isDark ? 'dark' : ''}>
      {/* Bouton toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-300 dark:bg-gray-700"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Contenu */}
    </div>
  )
}
```

---

## Extension 7 : Notifications Toast

### Système de notifications
```javascript
// src/hooks/useNotification.js

export const useNotification = () => {
  const [notifications, setNotifications] = React.useState([])

  const notify = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, duration)
  }

  return { notifications, notify }
}

// Composant Toast
export const Toast = ({ notifications }) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`px-4 py-3 rounded-lg text-white shadow-lg ${
            notif.type === 'success' ? 'bg-green-500' :
            notif.type === 'error' ? 'bg-red-500' :
            notif.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}
        >
          {notif.message}
        </div>
      ))}
    </div>
  )
}
```

### Utilisation
```jsx
const { notifications, notify } = useNotification()

const handleSave = () => {
  savePlan(currentPlan)
  notify('Plan sauvegardé avec succès !', 'success')
}
```

---

## Exemple Complet : Ajouter une Nouvelle Étape

```jsx
// src/wizard/steps/Step7Analytics.jsx

export const Step7Analytics = ({ onValidate }) => {
  const { currentPlan } = useMediaPlan()
  const { calculateROI } = useROICalculator()

  const roi = calculateROI(
    currentPlan.totalBudget,
    currentPlan.totalAudience
  )

  return (
    <div className="space-y-6">
      <Card title="📈 Analyses de Rentabilité">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">ROI Estimé</p>
            <p className="text-3xl font-bold text-blue-600">{roi.roi}%</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Conversions Estimées</p>
            <p className="text-3xl font-bold text-green-600">
              {roi.estimatedConversions.toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
      </Card>

      <Card title="💡 Recommandations">
        {roi.roi < 0 && (
          <p className="text-yellow-700 bg-yellow-50 px-4 py-2 rounded">
            ⚠️ ROI négatif. Augmentez la portée ou réduisez le budget.
          </p>
        )}
        {currentPlan.offers?.length < 5 && (
          <p className="text-blue-700 bg-blue-50 px-4 py-2 rounded">
            💡 Considérez d'ajouter plus de supports pour augmenter la couverture.
          </p>
        )}
      </Card>
    </div>
  )
}
```

---

**Ces exemples vous permettent d'étendre facilement l'application ! 🚀**
