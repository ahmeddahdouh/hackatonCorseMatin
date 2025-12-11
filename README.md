# 📊 Plan Média - Application Front-End Complète

Une application React/Vite 100% front-end pour créer et gérer des plans média sans dépendre d'un backend.

## 🎯 Objectifs

✅ **Wizard intuitif** : Assistant en 6 étapes pour composer des plans média
✅ **Dashboard analytics** : Graphiques et KPIs basés sur données JSON statiques
✅ **Gestion d'état global** : Context API pour centraliser les données
✅ **Persistance locale** : localStorage pour sauvegarder les plans
✅ **Design moderne** : TailwindCSS + composants réutilisables
✅ **Visualisations** : Recharts pour les graphiques professionnels

---

## 🏗️ Architecture du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Stepper.jsx
│   ├── FormField.jsx
│   ├── WizardLayout.jsx
│   ├── ChartCard.jsx
│   └── index.js
│
├── context/            # Gestion d'état global
│   └── MediaPlanContext.jsx
│
├── hooks/              # Hooks personnalisés
│   └── useDataLoader.js
│
├── pages/              # Pages principales
│   ├── Home.jsx       # Landing page
│   ├── Dashboard.jsx  # Tableau de bord
│   └── index.js
│
├── wizard/             # Système de wizard
│   ├── steps/
│   │   ├── Step1Client.jsx
│   │   ├── Step2Support.jsx
│   │   ├── Step3Format.jsx
│   │   ├── Step4Offer.jsx
│   │   ├── Step5Preview.jsx
│   │   └── Step6Validation.jsx
│   └── Wizard.jsx
│
├── utils/              # Fonctions utilitaires
│   └── calculations.js
│
├── styles/             # Styles CSS
│   └── index.css
│
├── App.jsx             # Composant root
└── main.jsx            # Entrée React

public/
└── data/               # Données JSON statiques
    ├── supports.json
    ├── formats.json
    ├── prices.json
    ├── audiences.json
    └── clients.json
```

### Rôle de chaque dossier

| Dossier | Rôle |
|---------|------|
| **components/** | Composants UI réutilisables (Button, Card, Stepper, etc.) |
| **context/** | Gestion d'état centralisée avec Context API |
| **hooks/** | Hooks personnalisés pour charger et manipuler les données |
| **pages/** | Pages principales de l'application (Home, Dashboard) |
| **wizard/** | Système wizard complet avec 6 étapes |
| **utils/** | Fonctions utilitaires (calculs, formatage, etc.) |
| **styles/** | Styles CSS/Tailwind |
| **public/data/** | Fichiers JSON contenant les données statiques |

---

## 🧙 Wizard - 6 Étapes Complètes

### Étape 1️⃣ : Informations Client
**Objectif** : Identifier le client et son type

**Champs** :
- `clientName` (string) : Nom du client
- `clientType` (enum) : B2C, B2B, Autre

**Validations** :
- Nom requis
- Type requis

**Exemple de donnée** :
```json
{
  "clientName": "Société X",
  "clientType": "B2C"
}
```

---

### Étape 2️⃣ : Sélection des Supports
**Objectif** : Choisir 1 ou plusieurs supports média

**Supports disponibles** :
- 📰 Quotidiens
- 📰 Hebdomadaires
- 🌐 Portails Web
- 📱 Applications Mobiles
- 👥 Réseaux Sociaux
- 🖼️ Display Réseau
- 🎬 Vidéo Streaming
- 🎙️ Podcasts

**État global** :
```javascript
selectedSupports: [
  { supportId: "press_daily", formatId: null, quantity: 1 }
]
```

**Validations** :
- Au moins 1 support requis

---

### Étape 3️⃣ : Sélection des Formats
**Objectif** : Choisir 1 format par support sélectionné

**Formats disponibles** (varient selon support) :
- Bannières (728x90, 300x250, 160x600)
- Vidéos (15s, 30s, 60s)
- Stories sociales
- Interstitiels
- Etc.

**État global** :
```javascript
selectedSupports: [
  { supportId: "press_daily", formatId: "format_full_page", quantity: 1 }
]
```

**Validations** :
- Un format requis par support

---

### Étape 4️⃣ : Configuration des Offres
**Objectif** : Définir les quantités → calcul du budget

**Champs** :
- `quantity` (int) : Nombre d'insertions/impressions/spots

**Calculs** :
- Prix = `pricePerUnit × quantity` (si insertion/spot)
- Prix = `(quantity / 1000) × pricePerUnit` (si CPM)
- Budget total mis à jour en temps réel

**Exemple** :
```json
{
  "supportId": "press_daily",
  "formatId": "format_full_page",
  "quantity": 2,
  "pricePerUnit": 15000,
  "totalPrice": 30000
}
```

**Validations** :
- Quantité ≥ 1

---

### Étape 5️⃣ : Aperçu du Plan
**Objectif** : Visualiser le plan avec graphiques

**Affichage** :
- 3 KPIs : Budget total, Portée, Impressions
- Graphique "Répartition budget par support" (Pie)
- Graphique "Répartition budget par format" (Pie)
- Tableau détaillé des offres

**Calculs** :
- Reach = `monthlyReach × quantity`
- Impressions = `monthlyImpressions × quantity`

---

### Étape 6️⃣ : Validation et Sauvegarde
**Objectif** : Finaliser et sauvegarder le plan

**Champs** :
- `planName` (string) : Nom du plan

**Processus** :
1. Validez le nom du plan
2. Plan sauvegardé en localStorage
3. État réinitialisé
4. Redirection vers Dashboard

**Données sauvegardées** :
```javascript
{
  id: "timestamp",
  clientName: "Société X",
  clientType: "B2C",
  planName: "Campagne Automne 2024",
  selectedSupports: [...],
  offers: [...],
  totalBudget: 50000,
  totalAudience: 5000000,
  createdAt: "2024-12-11T...",
  updatedAt: "2024-12-11T..."
}
```

---

## 📊 Fichiers JSON - Structure Complète

### 1️⃣ `supports.json`
Tous les supports média disponibles.

```json
{
  "supports": [
    {
      "id": "press_daily",
      "name": "Quotidiens",
      "category": "Presse",
      "icon": "📰",
      "description": "Journaux quotidiens nationaux et régionaux"
    }
  ]
}
```

**Champs** :
- `id` : Identifiant unique
- `name` : Nom du support
- `category` : Catégorie (Presse, Digital, Vidéo, Audio)
- `icon` : Emoji pour l'interface
- `description` : Description courte

---

### 2️⃣ `formats.json`
Tous les formats publicitaires par support.

```json
{
  "formats": [
    {
      "id": "format_full_page",
      "name": "Pleine Page",
      "supportIds": ["press_daily", "press_weekly"],
      "dimensions": "210x297mm",
      "description": "Annonce couvrant une page complète"
    }
  ]
}
```

**Champs** :
- `id` : Identifiant unique
- `name` : Nom du format
- `supportIds` : Supports compatibles (array)
- `dimensions` : Dimensions (px, mm, etc.)
- `description` : Description

---

### 3️⃣ `prices.json`
Prix pour chaque combinaison support/format.

```json
{
  "prices": [
    {
      "id": "price_1",
      "supportId": "press_daily",
      "formatId": "format_full_page",
      "pricePerUnit": 15000,
      "currency": "EUR",
      "minimumQuantity": 1,
      "unit": "insertion",
      "description": "Quotidien - Pleine Page"
    }
  ]
}
```

**Champs** :
- `supportId` + `formatId` : Clé composée unique
- `pricePerUnit` : Prix unitaire
- `unit` : "insertion", "CPM", "spot"
- `minimumQuantity` : Quantité min
- `currency` : Devise

**Types d'unités** :
- **insertion** : Prix par insertion (presse)
- **CPM** : Coût par mille impressions (digital)
- **spot** : Prix par spot audio (podcast)

---

### 4️⃣ `audiences.json`
Audience/reach pour chaque format.

```json
{
  "audiences": [
    {
      "id": "aud_1",
      "supportId": "press_daily",
      "formatId": "format_full_page",
      "monthlyReach": 2500000,
      "monthlyImpressions": 7500000,
      "targetDemographics": ["35-65", "Cadres"],
      "description": "Portée mensuelle..."
    }
  ]
}
```

**Champs** :
- `monthlyReach` : Portée mensuelle (contacts uniques)
- `monthlyImpressions` : Impressions mensuelles
- `targetDemographics` : Cibles démographiques

---

### 5️⃣ `clients.json` (optionnel)
Liste prédéfinie de clients.

```json
{
  "clients": [
    {
      "id": "client_demo",
      "name": "Client Exemple",
      "type": "B2C",
      "industry": "Retail"
    }
  ]
}
```

---

## 🎨 Composants Réutilisables

### `<Button />`
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Cliquez-moi
</Button>
```

**Props** :
- `variant` : "primary", "secondary", "danger", "success", "outline"
- `size` : "sm", "md", "lg"
- `disabled` : booléen
- `onClick` : fonction callback

---

### `<Card />`
```jsx
<Card title="Mon titre" icon="📊">
  Contenu personnalisé
</Card>
```

**Props** :
- `title` : Titre optionnel
- `icon` : Emoji ou icône
- `className` : Classes Tailwind

---

### `<Stepper />`
```jsx
<Stepper 
  steps={['Étape 1', 'Étape 2', 'Étape 3']}
  currentStep={0}
  onStepChange={setCurrentStep}
/>
```

---

### `<FormField />`
```jsx
<FormField
  label="Nom"
  name="clientName"
  type="text"
  value={value}
  onChange={handleChange}
  error={errors.clientName}
  required
/>
```

**Types** : "text", "number", "email", "textarea", "select"

---

### `<WizardLayout />`
```jsx
<WizardLayout
  title="Étape 1"
  subtitle="Sélectionnez un client"
  onNext={handleNext}
  onPrev={handlePrev}
>
  Contenu de l'étape
</WizardLayout>
```

---

### Composants Graphiques
```jsx
<PieChartComponent 
  data={data}
  dataKey="value"
  nameKey="name"
  title="Répartition"
/>

<BarChartComponent 
  data={data}
  dataKey="value"
  xKey="name"
  title="Comparaison"
/>

<LineChartComponent 
  data={data}
  dataKey="value"
  xKey="name"
  title="Évolution"
/>
```

---

## 🧠 Gestion d'État Global

### `MediaPlanContext`

**État** :
```javascript
{
  currentPlan: {
    id: null,
    clientName: '',
    clientType: '',
    selectedSupports: [],
    offers: [],
    totalBudget: 0,
    totalAudience: 0,
    createdAt: null,
    updatedAt: null
  },
  savedPlans: [],
  currentStep: 0
}
```

**Hooks** :
```javascript
const {
  currentPlan,
  savedPlans,
  currentStep,
  setCurrentStep,
  updateCurrentPlan,
  addOfferToCurrentPlan,
  removeOfferFromCurrentPlan,
  savePlan,
  loadPlan,
  deletePlan,
  resetCurrentPlan
} = useMediaPlan()
```

---

## 💾 LocalStorage

**Clé** : `mediaplans`

**Format** :
```javascript
[
  {
    id: "1734000000000",
    clientName: "Société X",
    planName: "Campagne Q4",
    totalBudget: 50000,
    // ... reste du plan
  }
]
```

**Opérations** :
- ✅ Sauvegarde automatique au clic "Terminer"
- ✅ Chargement au démarrage de l'app
- ✅ Suppression d'un plan
- ✅ Édition d'un plan existant

---

## 📐 Fonctions Utilitaires

### `calculatePrice(priceObj, quantity)`
Calcule le prix total selon l'unité.

```javascript
const total = calculatePrice(
  { unit: 'CPM', pricePerUnit: 10 },
  50000 // impressions
) // retourne: 500
```

---

### `calculateAudience(audienceObj, frequency)`
Calcule la portée totale.

```javascript
const reach = calculateAudience(
  { monthlyReach: 1000000 },
  2 // fréquence
) // retourne: 2000000
```

---

### `formatCurrency(amount, currency)`
Formate une devise.

```javascript
formatCurrency(15000, 'EUR') // "15 000,00 €"
```

---

### `calculatePlanStats(plan, priceData, audienceData)`
Calcule les statistiques complètes d'un plan.

```javascript
const stats = calculatePlanStats(currentPlan, pricesData, audiencesData)
// retourne: {
//   totalBudget: 50000,
//   totalReach: 5000000,
//   totalImpressions: 10000000,
//   offersBySupport: {...},
//   offersByFormat: {...}
// }
```

---

## 📊 Dashboard

### KPIs
- 💰 Budget Total (tous plans)
- 👥 Audience Totale (tous plans)
- 📋 Nombre de plans sauvegardés

### Graphiques
1. **Pie Chart** : Budget par support
2. **Pie Chart** : Budget par format
3. **Bar Chart** : Audience par support

### Tableau
Tableau des plans sauvegardés avec :
- Nom du plan
- Client
- Budget
- Audience
- Nombre d'offres
- Date
- Actions (Éditer, Supprimer)

---

## 🚀 Démarrage du Projet

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
# Ouverture automatique : http://localhost:5173
```

### Build
```bash
npm run build
# Sortie : dist/
```

### Preview
```bash
npm run preview
```

---

## 📦 Dépendances

| Package | Rôle |
|---------|------|
| **react** | Framework UI |
| **react-dom** | Rendu React |
| **recharts** | Graphiques |
| **tailwindcss** | Design system |
| **vite** | Build tool |

---

## 🎯 Flux Principal

```
Home (landing)
    ↓
Wizard (6 étapes)
    ↓
Dashboard (gestion des plans)
    ↓
Actions:
    - Créer nouveau plan → Wizard
    - Éditer un plan → Wizard
    - Supprimer un plan → localStorage
    - Voir détails → Dashboard
```

---

## 🔮 Améliorations Futures

### 1. **Export PDF**
Générer un PDF du plan média complet avec en-têtes, graphiques, et tableau.

### 2. **Suggestions Automatiques**
IA simple pour recommander des combinaisons support/format basées sur :
- Budget maximum
- Audience cible
- Secteur d'activité

### 3. **Prévisions Audience**
Modèle simplifié de fréquence :
- Audience = reach × (1 + (frequency - 1) × decay factor)

### 4. **Tableau Comparatif**
Comparaison côte-à-côte de 2-3 plans :
- Budget
- Audience
- CPM effectif
- ROI estimé

### 5. **Historique et Versioning**
- Versions antérieures d'un plan
- Changelog des modifications
- Restauration d'une version

### 6. **Import/Export CSV**
- Exporter les plans en CSV
- Importer des offres depuis CSV

### 7. **Multi-Langue**
- Français/Anglais
- Devises différentes

### 8. **Calendrier Média**
- Visualisation temporelle des insertions
- Chevauchements de supports

### 9. **Templates**
- Modèles de plans pré-configurés
- Clonage de plans existants

### 10. **Collaboration Temps Réel**
- Share link des plans
- Commentaires collaboratifs
- (via backend future)

---

## 📝 Notes Techniques

### Choix Architecturaux

✅ **Context API vs Zustand** : Context choisi pour sa simplicité et l'absence de dépendances externes.

✅ **localStorage** : Idéal pour un prototype front-end. Facilement remplaçable par une API REST.

✅ **Recharts** : Bibliothèque légère, declarative, parfaite pour Vite.

✅ **TailwindCSS** : Design system utilitaire, production-ready.

### Limitations Actuelles

⚠️ LocalStorage limité à ~5MB (suffit pour 100-200 plans)

⚠️ Pas d'import de données JSON externes (données statiques seulement)

⚠️ Pas de collaboration temps réel

### Évolutions Possibles

🔄 Connecter un backend Node.js/Python pour :
- Persistance en base de données
- Authentification utilisateurs
- Collaboration temps réel
- Export PDF serveur

---

## 🤝 Contribution

Pour améliorer l'app :
1. Fork le repo
2. Branch feature (`git checkout -b feature/new-feature`)
3. Commit (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/new-feature`)
5. Ouvrir une PR

---

## 📄 License

MIT - Libre d'utilisation et modification

---

**Créé avec ❤️ par votre équipe front-end**
