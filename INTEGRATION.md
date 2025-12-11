# 📚 Guide Complet d'Intégration et Bonnes Pratiques

## 🔌 Intégration des Données JSON

### Comment les données sont chargées ?

```javascript
// Dans useDataLoader.js
export const useDataLoader = (filename) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/data/${filename}`)
        if (!response.ok) throw new Error(`Failed to load ${filename}`)
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filename])

  return { data, loading, error }
}
```

### Utilisation dans les composants

```jsx
// Dans un composant
const { data: supportsData, loading, error } = useDataLoader('supports.json')

if (loading) return <div>Chargement...</div>
if (error) return <div>Erreur: {error}</div>

const supports = supportsData?.supports || []
```

---

## 📊 Centralisation des Données avec Context API

### Pattern de gestion d'état

```javascript
// MediaPlanContext.jsx
import React, { createContext, useState, useCallback, useEffect } from 'react'

export const MediaPlanContext = createContext()

export const MediaPlanProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState(createEmptyMediaPlan())
  const [savedPlans, setSavedPlans] = useState([])
  const [currentStep, setCurrentStep] = useState(0)

  // Sauvegarder en localStorage
  useEffect(() => {
    localStorage.setItem('mediaplans', JSON.stringify(savedPlans))
  }, [savedPlans])

  // Actions
  const updateCurrentPlan = useCallback((updates) => {
    setCurrentPlan(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const savePlan = useCallback((plan) => {
    const planToSave = {
      ...plan,
      id: plan.id || Date.now().toString(),
      updatedAt: new Date().toISOString(),
    }

    setSavedPlans(prev => [...prev.filter(p => p.id !== planToSave.id), planToSave])
    return planToSave
  }, [])

  const value = {
    currentPlan,
    savedPlans,
    currentStep,
    setCurrentStep,
    updateCurrentPlan,
    savePlan,
    // ... autres méthodes
  }

  return (
    <MediaPlanContext.Provider value={value}>
      {children}
    </MediaPlanContext.Provider>
  )
}

export const useMediaPlan = () => {
  const context = React.useContext(MediaPlanContext)
  if (!context) {
    throw new Error('useMediaPlan must be used within MediaPlanProvider')
  }
  return context
}
```

### Utilisation du Context dans un composant

```jsx
const { currentPlan, updateCurrentPlan, savePlan } = useMediaPlan()

const handleChange = (e) => {
  updateCurrentPlan({
    clientName: e.target.value
  })
}
```

---

## 🧮 Calculs et Logique Métier

### Structure d'une offre complète

```javascript
const offer = {
  supportId: 'press_daily',
  formatId: 'format_full_page',
  supportName: 'Quotidiens',
  formatName: 'Pleine Page',
  quantity: 2,
  totalPrice: 30000,        // calculé
  reach: 5000000,           // calculé
  impressions: 15000000,    // calculé
}
```

### Exemple de calcul CPM

```javascript
// Pour un format avec unité CPM
const priceObj = {
  unit: 'CPM',
  pricePerUnit: 10  // 10€ par 1000 impressions
}

const quantity = 50000  // impressions

const totalPrice = calculatePrice(priceObj, quantity)
// = (50000 / 1000) * 10 = 500€
```

### Exemple de calcul insertion

```javascript
// Pour un format avec unité insertion
const priceObj = {
  unit: 'insertion',
  pricePerUnit: 15000  // 15000€ par insertion
}

const quantity = 2  // insertions

const totalPrice = calculatePrice(priceObj, quantity)
// = 15000 * 2 = 30000€
```

### Calcul du CPM effectif

```javascript
// Utile pour comparer des supports différents
const effectiveCPM = calculateEffectiveCPM(
  totalPrice,    // 500€
  impressions    // 50000
)
// = (500 / 50000) * 1000 = 10€ CPM
```

---

## 💾 Gestion du LocalStorage

### Structure de stockage

```javascript
// localStorage key: 'mediaplans'
const stored = JSON.parse(localStorage.getItem('mediaplans'))
// [
//   {
//     id: '1734000000000',
//     clientName: 'Société X',
//     clientType: 'B2C',
//     planName: 'Campagne Automne',
//     selectedSupports: [...],
//     offers: [...],
//     totalBudget: 50000,
//     totalAudience: 5000000,
//     createdAt: '2024-12-11T10:00:00Z',
//     updatedAt: '2024-12-11T10:30:00Z'
//   },
//   // ... autres plans
// ]
```

### Opérations courantes

```javascript
// 1. Sauvegarder un nouveau plan
const planToSave = {
  ...currentPlan,
  id: Date.now().toString(),
  createdAt: new Date().toISOString(),
}
savePlan(planToSave)

// 2. Charger un plan existant
const plan = savedPlans.find(p => p.id === planId)
if (plan) {
  loadPlan(plan.id)
}

// 3. Supprimer un plan
deletePlan(planId)

// 4. Mettre à jour un plan existant
const updated = {
  ...plan,
  clientName: 'Nouveau nom',
  updatedAt: new Date().toISOString()
}
savePlan(updated)
```

---

## 🎨 Patterns de Composants

### Pattern : Composant formulaire avec validation

```jsx
export const MyFormStep = ({ onValidate }) => {
  const { currentPlan, updateCurrentPlan } = useMediaPlan()
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    updateCurrentPlan({ [name]: value })
    
    // Nettoyer les erreurs au fur et à mesure
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    // Validation métier
    if (!currentPlan.fieldName?.trim()) {
      newErrors.fieldName = 'Ce champ est requis'
    }

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onValidate() // Avancer à l'étape suivante
    }
    
    return Object.keys(newErrors).length === 0
  }

  // Enregistrer la fonction de validation globale
  React.useEffect(() => {
    window.wizardValidate = validate
  }, [currentPlan])

  return (
    <div className="space-y-6">
      <FormField
        label="Nom"
        name="fieldName"
        value={currentPlan.fieldName || ''}
        onChange={handleChange}
        error={errors.fieldName}
        required
      />
    </div>
  )
}
```

### Pattern : Composant de sélection avec liste

```jsx
export const SelectionList = ({ items, selectedIds, onToggle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map(item => (
        <Card
          key={item.id}
          className={`cursor-pointer transition-all border-2 ${
            selectedIds.includes(item.id)
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-400'
          }`}
          onClick={() => onToggle(item.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              selectedIds.includes(item.id)
                ? 'bg-blue-600 border-blue-600'
                : 'border-gray-300'
            }`}>
              {selectedIds.includes(item.id) && (
                <span className="text-white text-sm">✓</span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
```

---

## 📈 Patterns de Graphiques

### Pattern : Pie Chart avec données agrégées

```jsx
import { PieChartComponent } from '../components/ChartCard'

export const BudgetBySupport = ({ offers }) => {
  // Agréger les données
  const data = Object.values(
    offers.reduce((acc, offer) => {
      if (!acc[offer.supportName]) {
        acc[offer.supportName] = { name: offer.supportName, value: 0 }
      }
      acc[offer.supportName].value += offer.totalPrice
      return acc
    }, {})
  )

  return (
    <PieChartComponent
      data={data}
      dataKey="value"
      nameKey="name"
      title="Budget par Support"
    />
  )
}
```

### Pattern : Bar Chart avec comparaison

```jsx
import { BarChartComponent } from '../components/ChartCard'

export const AudienceBySupport = ({ offers }) => {
  const data = Object.values(
    offers.reduce((acc, offer) => {
      if (!acc[offer.supportName]) {
        acc[offer.supportName] = { name: offer.supportName, value: 0 }
      }
      acc[offer.supportName].value += offer.reach
      return acc
    }, {})
  )

  return (
    <BarChartComponent
      data={data}
      dataKey="value"
      xKey="name"
      title="Audience par Support"
    />
  )
}
```

---

## 🔄 Migration vers un Backend

### Étapes de migration

1. **Remplacer les données statiques**
   ```javascript
   // Avant (statique)
   const { data: supports } = useDataLoader('supports.json')

   // Après (API)
   const [supports, setSupports] = useState([])
   useEffect(() => {
     fetch('/api/supports')
       .then(r => r.json())
       .then(setSupports)
   }, [])
   ```

2. **Remplacer localStorage par API**
   ```javascript
   // Avant (localStorage)
   localStorage.setItem('mediaplans', JSON.stringify(savedPlans))

   // Après (API)
   fetch('/api/plans', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(plan)
   })
   ```

3. **Ajouter authentification**
   ```javascript
   const headers = {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   }
   ```

### Exemple de service API

```javascript
// services/mediaApi.js
export const mediaApi = {
  // Supports
  getSupports: () => fetch('/api/supports').then(r => r.json()),
  
  // Formats
  getFormats: () => fetch('/api/formats').then(r => r.json()),
  
  // Plans
  getPlans: () => fetch('/api/plans').then(r => r.json()),
  savePlan: (plan) => fetch('/api/plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan)
  }).then(r => r.json()),
  updatePlan: (id, plan) => fetch(`/api/plans/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan)
  }).then(r => r.json()),
  deletePlan: (id) => fetch(`/api/plans/${id}`, {
    method: 'DELETE'
  }).then(r => r.json()),
}
```

---

## 🧪 Testabilité

### Exemple de test pour un composant étape

```javascript
// Step1Client.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Step1Client } from '../Step1Client'
import { MediaPlanProvider } from '../../context/MediaPlanContext'

describe('Step1Client', () => {
  it('valide le formulaire avec les champs requis', () => {
    const onValidate = jest.fn()
    
    render(
      <MediaPlanProvider>
        <Step1Client onValidate={onValidate} />
      </MediaPlanProvider>
    )

    const nameInput = screen.getByPlaceholderText('Ex: Société X')
    fireEvent.change(nameInput, { target: { value: 'Société Test' } })

    const typeSelect = screen.getByDisplayValue('-- Sélectionner --')
    fireEvent.change(typeSelect, { target: { value: 'B2C' } })

    const nextButton = screen.getByText('Suivant')
    fireEvent.click(nextButton)

    expect(onValidate).toHaveBeenCalled()
  })
})
```

---

## 🚀 Performance

### Optimisations recommandées

1. **Code Splitting**
   ```javascript
   const Wizard = lazy(() => import('./wizard/Wizard'))
   const Dashboard = lazy(() => import('./pages/Dashboard'))
   ```

2. **Memoization**
   ```javascript
   export const Step = memo(({ data, onChange }) => {
     return <div>{/* ... */}</div>
   })
   ```

3. **Lazy loading d'images**
   ```jsx
   <img loading="lazy" src="..." alt="..." />
   ```

4. **Vite optimizations**
   ```javascript
   // vite.config.js
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             recharts: ['recharts']
           }
         }
       }
     }
   })
   ```

---

## 📱 Responsive Design

### Breakpoints TailwindCSS utilisés

| Prefix | Width | Usage |
|--------|-------|-------|
| `sm` | 640px | Tablettes petites |
| `md` | 768px | Tablettes |
| `lg` | 1024px | Desktops |
| `xl` | 1280px | Grands desktops |

### Pattern de grille responsive

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 colonne, Tablet: 2, Desktop: 3 */}
</div>
```

---

## 🔐 Sécurité

### Points d'attention

⚠️ **LocalStorage n'est pas sécurisé** pour les données sensibles
- Les plans sont publiquement lisibles sur l'appareil
- Solution : chiffrer avant stockage ou utiliser une API sécurisée

⚠️ **Validation côté client**
- Ne jamais faire confiance aux données du client
- Toujours valider côté serveur aussi

⚠️ **CORS**
- Configurez correctement les headers CORS sur votre API

---

## 📞 Troubleshooting

### "données n'apparaissent pas"
- Vérifier que les fichiers JSON sont dans `public/data/`
- Vérifier les chemins `fetch('/data/...')`
- Vérifier la structure des JSON avec les hooks

### "localStorage plein"
- Vérifier la taille des plans
- Nettoyer les anciens plans
- Passer à une API backend

### "Graphiques ne s'affichent pas"
- Vérifier que `monthlyReach` et `monthlyImpressions` existent dans audiences.json
- Vérifier que les données sont chargées (`loading` === false)

---

**Bon développement ! 🚀**
