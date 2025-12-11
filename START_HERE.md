# ⚡ ACCÈS RAPIDE - Plan Média Pro v2.0

## 🌐 **Ouvrir l'Application Maintenant**

```
http://localhost:5173
```

Le serveur tourne déjà ! ✅

---

## 📚 Lire D'Abord (Par Ordre)

### 1️⃣ **SUMMARY.md** (5 min)
Résumé complet de ce qui a été fait
- Nouveautés v2.0
- Cas d'usage exemple
- Résultats pour 15 000€

### 2️⃣ **README_CORSE.md** (10 min)
Vue complète de la version Corse
- Démarrage rapide
- Caractéristiques clés
- Cas d'usage multiples

### 3️⃣ **SCENARIO_CORSE.md** (10 min)
Cas d'usage détaillé complet
- Flux utilisateur détaillé
- Supports Corse description
- Calculs pas à pas

### 4️⃣ **TESTING_GUIDE.md** (5 min)
Guide pour tester l'application
- Test rapide 2 min
- Vérifications détaillées
- Checklist problèmes

---

## 🎬 Test Rapide (2 Minutes)

```bash
# 1. Ouvrir navigateur
http://localhost:5173

# 2. Cliquer: "Créer un Plan Média"

# 3. Saisir:
   - Objectifs: ✓ Notoriété, ✓ Trafic Web
   - Âge: 25-40 ans
   - CSP: CSP+
   - Région: Corse-du-Sud
   → Cliquer: "Suivant"

# 4. Saisir Budget:
   - 15 000€ (ou cliquer "Budget Moyen")
   → Cliquer: "Générer Plan"

# 5. Voir Plan Généré:
   - Budget: 15 000€
   - Audience: 1.933M
   - Impressions: 5.9M
   - CPM: 2.54€
   → Cliquer: "Aperçu & PDF"

# 6. Télécharger PDF:
   - Voir 4 KPI cards
   - Voir 3 graphiques
   - Cliquer: "📄 Télécharger en PDF"
   → Fichier téléchargé!

✅ Fini en ~2 minutes
```

---

## 📁 Structure Fichiers

```
corseMatinCalculate/
│
├── 📖 DOCUMENTATION (Lire ici)
│   ├── SUMMARY.md ←← COMMENCER ICI (5 min)
│   ├── README_CORSE.md (10 min)
│   ├── SCENARIO_CORSE.md (15 min)
│   ├── TESTING_GUIDE.md (5 min)
│   ├── README.md (technique)
│   └── (autres docs v1)
│
├── 🚀 CODE SOURCE
│   ├── src/
│   │   ├── wizard/Wizard.jsx (4 étapes)
│   │   ├── wizard/steps/
│   │   │   ├── Step1Objectives.jsx (NEW)
│   │   │   ├── Step2Budget.jsx (NEW)
│   │   │   ├── Step3GeneratedPlan.jsx (NEW)
│   │   │   └── Step4ReportPDF.jsx (NEW)
│   │   ├── utils/
│   │   │   ├── smartPlanGenerator.js (NEW algo)
│   │   │   └── pdfExporter.js (NEW PDF)
│   │   └── (autres composants)
│   │
│   └── public/data/ (JSON Corse)
│       ├── supports.json (8 supports)
│       ├── formats.json (9 formats)
│       ├── prices.json (9 tarifications)
│       └── audiences.json (9 audiences)
│
├── ⚙️ CONFIG
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── 📊 INFO
    ├── SUMMARY.md ← COMMENCER ICI
    └── (autres info)
```

---

## 🎯 Points Clés à Retenir

### Application Fait
✅ Génère plan en 30 secondes
✅ Données Corse réalistes (8 supports)
✅ Tarification authentique (2024)
✅ Export PDF professionnel
✅ Calculs KPI automatiques
✅ 3 graphiques Recharts
✅ Interface intuitive

### Supports Intégrés
```
1. Corse-Matin (quotidien)
2. corsematin.com (web)
3. Appli Corsica+ (mobile)
4. Facebook Corse (social)
5. Instagram Corse (social)
6. Affichage Ajaccio (outdoor)
7. Radio Corse (audio)
8. YouTube Corsica (video)
```

### Cas d'Usage Exemple
```
Budget: 15 000€
Cible: 25-40 ans, CSP+, Corse-du-Sud
Objectifs: Notoriété + Trafic Web

Résultat Auto:
  - 40% Print (Corse-Matin + Affichage)
  - 60% Digital (Web + Apps + Social)
  - Audience: 1.933M
  - Impressions: 5.9M
  - CPM: 2.54€
  - PDF: Téléchargé ✓
```

---

## 🚀 Commandes Utiles

```bash
# Démarrer dev server (déjà actif)
npm run dev

# Arrêter (Ctrl+C), relancer
npm run dev

# Build production
npm run build

# Voir erreurs build
npm run build 2>&1

# Clear cache
rm -r node_modules
npm install
npm run dev
```

---

## 💡 Avant de Commencer

### ✅ Vérifier
```
☑️ Node/npm installés
☑️ npm run dev en cours (ou relancer)
☑️ Pas d'erreur dans terminal
☑️ http://localhost:5173 accessible
☑️ Page charge (< 3 secondes)
```

### 🚫 Si problème
```
? App ne charge pas
  → Relancer: npm run dev
  → URL: http://localhost:5173 (pas 3000)
  → F5 rafraîchir

? Erreurs build
  → npm run build (voir erreurs)
  → Vérifier console F12

? Données ne chargent
  → F12 > Network > chercher requests JSON
  → Vérifier public/data/*.json existe
```

---

## 📞 Support Rapide

### Documentation
- **SUMMARY.md** - Vue d'ensemble
- **README_CORSE.md** - Guide complet
- **SCENARIO_CORSE.md** - Cas d'usage
- **TESTING_GUIDE.md** - Tests
- **README.md** - Technique

### Fichiers Clés
- `src/utils/smartPlanGenerator.js` - Algorithme
- `src/utils/pdfExporter.js` - Export PDF
- `src/wizard/Wizard.jsx` - Navigation wizard
- `public/data/*.json` - Données Corse

---

## ⏱️ Temps Estimé

| Activité | Temps |
|----------|-------|
| Lire SUMMARY.md | 5 min |
| Lire README_CORSE.md | 10 min |
| Test rapide app | 2 min |
| Télécharger PDF | 1 min |
| Tester 3 budgets différents | 10 min |
| **Total** | **~30 min** |

---

## ✅ Checklist Finale

```
☑️ SUMMARY.md lu (vue d'ensemble)
☑️ README_CORSE.md lu (guide complet)
☑️ App ouverte (http://localhost:5173)
☑️ Plan créé (15 000€)
☑️ PDF téléchargé
☑️ Calculs vérifiés
☑️ Graphiques vus
☑️ Prêt à utiliser!
```

---

## 🎯 Prochaines Étapes

### Immédiatement
1. Ouvrir http://localhost:5173
2. Créer plan 15 000€
3. Télécharger PDF
4. Vérifier contenu PDF

### Aujourd'hui
1. Lire SCENARIO_CORSE.md
2. Tester avec budgets différents
3. Tester cibles différentes
4. Vérifier localStorage (créer plan, F5)

### Cette Semaine
1. Adapter JSON à vos supports
2. Personnaliser couleurs
3. Ajouter vos supports manquants
4. Préparer présentation client

### Bientôt
1. Déployer en production
2. Connecter API backend (si besoin)
3. Ajouter authentification
4. Intégrer sur site

---

## 📱 Accès Mobile

L'app est responsive! Testez sur:
```
🖥️ Desktop: http://localhost:5173
📱 Mobile: http://VOTRE_IP:5173
   (remplacer VOTRE_IP par IP locale)
```

---

## 🎁 Résumé Final

Vous avez une **application complète** qui:

✅ Génère plans en 30s
✅ Données Corse réalistes
✅ Export PDF professionnel
✅ Interface intuitive
✅ Calculs automatiques
✅ Graphiques pro
✅ Code production-ready

**Prêt à l'emploi immédiatement!**

---

## 🚀 **Commencez Maintenant**

1. Ouvrez: **http://localhost:5173**
2. Lisez: **SUMMARY.md**
3. Testez: **Créer un plan**
4. Téléchargez: **PDF**

**C'est tout! 🎉**

---

**Version:** 2.0.0 (Corse Edition)  
**Status:** ✅ Production Ready  
**Support:** Documentation complète
