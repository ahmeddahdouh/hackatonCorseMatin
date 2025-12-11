# 📋 STRUCTURE DE L'APPLICATION v3.0

## 🎯 Vue d'ensemble

L'application est maintenant structurée avec **4 étapes de saisie détaillées** respectant tous les critères Corse-Matin.

```
Calculette Plan Média Corse-Matin v3.0
│
├─ 📋 ÉTAPE 1 (Campagne)
│  ├─ Nom de campagne
│  ├─ Secteur d'activité (11 options)
│  ├─ Période de diffusion (dates ou durée)
│  ├─ Zone géographique (3 zones + micro-régions)
│  └─ → Validation obligatoire
│
├─ 🎯 ÉTAPE 2 (Objectifs)
│  ├─ Notoriété
│  ├─ Image / Branding
│  ├─ Drive-to-Store
│  ├─ Trafic Web / E-commerce
│  ├─ Lancement Produit
│  ├─ Fidélisation / Engagement
│  └─ → Multi-sélection (Min 1)
│
├─ 👥 ÉTAPE 3 (Cibles)
│  ├─ Tranches d'âge (5 groupes)
│  ├─ Sexe (Mixte / H / F)
│  ├─ CSP (5 catégories)
│  ├─ Intérêts / Affinités (8 options, optionnel)
│  ├─ Zones géographiques (4 types)
│  └─ → Validation: Âge + CSP + Zone
│
├─ 💰 ÉTAPE 4 (Budget)
│  ├─ Budget HT (1k€ - 500k€)
│  ├─ Mode répartition:
│  │  ├─ Auto (Par défaut, optimisé selon objectifs)
│  │  └─ Personnalisé (Sliders: Print/Digital/RS/Event)
│  ├─ Aperçu répartition en temps réel
│  └─ → Validation: Budget + Répartition = 100%
│
└─ [Futures étapes 5-8]
   ├─ Sélection supports (optionnel)
   ├─ Génération plan automatique
   ├─ Aperçu + Validation
   └─ Export PDF avec KPIs
```

---

## 📂 Arborescence des Fichiers

```
corseMatinCalculate/
├── src/
│   ├── wizard/
│   │   ├── Step1Campaign.jsx       ⭐ NEW (350 lignes)
│   │   ├── Step2Objectives.jsx     ⭐ NEW (250 lignes)
│   │   ├── Step3Targets.jsx        ⭐ NEW (400+ lignes)
│   │   ├── Step4Budget.jsx         ⭐ NEW (450+ lignes)
│   │   ├── Wizard.jsx              ✏️ MODIFIÉ (restructuré)
│   │   ├── Step1Objectives.jsx     ❌ OBSOLÈTE (à supprimer)
│   │   ├── Step2Budget.jsx         ❌ OBSOLÈTE (à supprimer)
│   │   ├── Step3GeneratedPlan.jsx  ❌ OBSOLÈTE (à supprimer)
│   │   └── Step4ReportPDF.jsx      ❌ OBSOLÈTE (à supprimer)
│   │
│   ├── components/
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   ├── FormField.jsx
│   │   └── ...
│   │
│   ├── utils/
│   │   ├── smartPlanGenerator.js   (À mettre à jour Phase 2)
│   │   ├── pdfExporter.js          (À mettre à jour Phase 2)
│   │   └── calculations.js
│   │
│   ├── context/
│   │   └── MediaPlanContext.js
│   │
│   ├── hooks/
│   │   └── useDataLoader.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css                   ✏️ MODIFIÉ (Tailwind 4)
│   └── main.jsx
│
├── public/
│   └── data/
│       ├── sectors.json            ⭐ NEW (11 secteurs)
│       ├── supports.json           ✏️ MODIFIÉ (17 supports)
│       ├── formats.json            ✏️ MODIFIÉ (22 formats)
│       ├── prices.json             (À enrichir Phase 2)
│       └── audiences.json          (À enrichir Phase 2)
│
├── tailwind.config.js              ✏️ MODIFIÉ (Palette Corse-Matin)
├── vite.config.js                  (Inchangé)
├── postcss.config.js               (Inchangé)
├── package.json                    ✏️ MODIFIÉ (+lucide-react)
├── index.html                      (Inchangé)
│
├── UPGRADE_v3_0.md                 ⭐ NEW (Documentation complète)
├── CHANGELOG.md                    ⭐ NEW (Historique v1-v2-v3)
├── START_HERE.md                   ✏️ MODIFIÉ (À mettre à jour)
└── README.md                       ✏️ MODIFIÉ (À mettre à jour)
```

---

## 🎨 Configuration Charte Corse-Matin

### tailwind.config.js (Palette intégrée)

```javascript
colors: {
  'corse-rouge': '#E60000',      // Principal - Boutons, accents
  'corse-gris': '#333333',       // Secondaire - Textes, borders
  'corse-noir': '#000000',       // Titres, texte principal
  'corse-blanc': '#FFFFFF',      // Fonds, arrière-plans
  
  // Variations
  'corse-rouge-light': '#FF3333',
  'corse-rouge-dark': '#CC0000',
  'corse-gris-light': '#555555',
  'corse-gris-lighter': '#888888',
}
```

### Applications dans l'UI

- **Boutons primaires:** `bg-gradient-to-r from-corse-rouge to-red-700`
- **Titres:** `text-corse-noir` + `border-l-4 border-corse-rouge`
- **Sliders:** `accent-corse-rouge`
- **Barre progression:** `bg-gradient-to-r from-corse-rouge to-red-700`
- **Stepper actif:** `bg-corse-rouge text-white`
- **Stepper complété:** `bg-green-500` (✓)

---

## 📊 Données Structurées

### sectors.json (NEW - 11 secteurs)
```json
[
  { "id": "distribution", "name": "Distribution / Commerce", ... },
  { "id": "automobile", "name": "Automobile", ... },
  { "id": "btp", "name": "BTP / Immobilier", ... },
  { "id": "sante", "name": "Santé / Bien-être", ... },
  { "id": "tourisme", "name": "Tourisme / Loisirs", ... },
  ...
]
```

### supports.json (UPDATED - 17 supports)
```json
[
  Print:
  - print-quotidien: Corse-Matin
  - print-moteurs: Supplément Moteurs
  - print-immo: Supplément Immobilier
  - print-economie: Supplément Économia
  - print-emploi: Supplément Emploi
  - print-sante: Supplément Santé
  - magazine-diverto: Magazine Diverto
  - magazine-femina: Magazine Femina
  
  Digital:
  - site-corsematin: corsematin.com
  - app-corsematin: Application mobile
  
  Social:
  - facebook-corsematin: Facebook
  - instagram-corsematin: Instagram
  - linkedin-corsematin: LinkedIn
  - youtube-corsematin: YouTube
  
  Event:
  - event-impresa: Club Impresa
  - event-sante: Parlons Santé
  - event-trophees: Trophées Corse-Matin
]
```

### formats.json (UPDATED - 22 formats)
```
Print (7):
  fmt_demi_page, fmt_quart_page, fmt_pavé, fmt_supplement,
  fmt_magazine_pleine, fmt_magazine_demi

Digital (5):
  fmt_web_habillage, fmt_web_pavé, fmt_web_skyscraper,
  fmt_app_smartcover, fmt_app_interstitiel

Social (5):
  fmt_facebook_post, fmt_facebook_carousel, fmt_instagram_post,
  fmt_instagram_story, fmt_instagram_reel, fmt_linkedin_post,
  fmt_youtube_preroll, fmt_youtube_bumper

Outdoor (1):
  fmt_affichage_4x3

Audio (2):
  fmt_radio_30s, fmt_radio_60s

Event (1):
  fmt_event_sponsoring
```

---

## 🔄 Flux de Données (State Management)

### Wizard.jsx State
```javascript
const [planData, setPlanData] = useState({
  // Étape 1
  campaignName: '',
  sector: '',
  diffusionStartDate: '',
  diffusionEndDate: '',
  diffusionDuration: '',
  region: '',
  microRegions: [],
  
  // Étape 2
  objectives: [],
  
  // Étape 3
  ageRanges: [],
  gender: 'mixte',
  cspLevels: [],
  interests: [],
  geographicTargets: [],
  
  // Étape 4
  budget: 15000,
  distributionMode: 'auto',
  customDistribution: { print, digital, social, event },
  effectiveDistribution: {},
});
```

### Passage entre étapes
1. Chaque Step reçoit `planData`, `onUpdate`, `onNext`, `onBack`
2. `onUpdate(data)` merge les données dans l'état global
3. `onNext()` incrémente l'étape courante
4. `onBack()` décrémente l'étape courante

---

## ✅ Validations Implémentées

### Step1Campaign
- ✅ campaignName: Non vide
- ✅ sector: Sélectionné
- ✅ diffusion: Dates OU durée obligatoire
- ✅ region: Sélectionné
- ✅ microRegions: Optionnel

### Step2Objectives
- ✅ objectives: Min 1 sélectionné

### Step3Targets
- ✅ ageRanges: Min 1 sélectionné
- ✅ cspLevels: Min 1 sélectionné
- ✅ geographicTargets: Min 1 sélectionné
- ✅ gender: Toujours valide (défaut 'mixte')
- ✅ interests: Optionnel

### Step4Budget
- ✅ budget: Min 1 000€
- ✅ distributionMode: Valide si 'auto' ou 'custom'
- ✅ customDistribution: Doit totaliser 100% (si custom)

---

## 🎯 Logique Métier

### Répartition Auto (par défaut)

```javascript
const getAutoDistribution = () => {
  const hasTraficWeb = objectives.includes('trafic-web');
  
  if (hasTraficWeb) {
    return { print: 30, digital: 60, social: 10, event: 0 };
  }
  return { print: 40, digital: 45, social: 15, event: 0 };
};
```

### Calcul Budget par Canal

```javascript
const calculateChannelBudget = (channel) => {
  return Math.round((budgetAmount * distribution[channel]) / 100);
};
// Exemple: 25 000€ × 40% (print) = 10 000€
```

---

## 🚀 Prochaines Implémentations

### Phase 2: Génération Plan (Étapes 5-8)

1. **Step5Supports** (Optionnel)
   - Sélection supports per canal
   - Multi-select par catégorie
   - Prévisualisation reach/impressions

2. **Step6GeneratedPlan**
   - Appel `generateSmartPlan()` (à mettre à jour)
   - Affichage plan suggéré avec KPIs
   - Tableaux détaillés: Support, Format, Quantité, Reach, Impr, Prix

3. **Step7Review**
   - Aperçu complet du plan
   - Validation cohérence
   - Suggestions d'amélioration

4. **Step8PDF**
   - Export PDF professionnel
   - En-têtes Corse-Matin rouge
   - Graphiques répartition
   - KPIs enrichis

### Améliorations Algorithme

```javascript
// À adapter dans smartPlanGenerator.js
generateSmartPlan(
  objectives,        // 6 possibles maintenant
  targetAudience,    // Plus détaillé (âge, CSP, zone, intérêts)
  budget,
  distribution,      // Multi-canal (print, digital, social, event)
  supportsPrices,
  allSupports,
  allFormats,
  allAudiences
)
```

### KPIs Enrichis pour PDF

- Couverture (% cible atteinte)
- Fréquence d'exposition
- CTR estimé par format
- Vues vidéo (si formats vidéo)
- GRP (Gross Rating Points)
- Coût par contact unique
- Coût par action (CPA estimé)

---

## 🔧 Commandes Utiles

### Développement
```bash
npm run dev          # Serveur Vite (http://localhost:5173)
npm run build        # Build production
npm run preview      # Aperçu build
```

### Nettoyage (Optionnel Phase 2)
```bash
# Supprimer les anciennes étapes
rm src/wizard/Step1Objectives.jsx
rm src/wizard/Step2Budget.jsx
rm src/wizard/Step3GeneratedPlan.jsx
rm src/wizard/Step4ReportPDF.jsx
```

---

## 📈 Métriques Build

```
✓ 2339 modules transformed
✓ CSS: 36.46 kB (gzipped 6.61 kB)
✓ JS: 605.73 kB (gzipped 180.24 kB)
✓ Build time: 5.96s
✓ 0 errors
✓ 0 vulnerabilities
```

---

## 📞 Notes Importantes

1. **Données Phase 2:** `prices.json` et `audiences.json` à enrichir avec:
   - Tarifs réels pour tous les supports
   - Audiences détaillées par démographie
   - CPM/CPC par format

2. **Persistance:** À ajouter localStorage pour sauvegarder `planData`

3. **Export:** À mettre à jour `pdfExporter.js` pour nouvelle structure

4. **Testing:** Créer tests unitaires pour validations et logique métier

---

**Version:** 3.0.0  
**Status:** ✅ Production-Ready (Étapes 1-4)  
**Next Phase:** Étapes 5-8 + Génération + Export

